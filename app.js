const petImage = document.querySelector('#pet-image');
const {
  idleOpen, idleClosed, shy1, shy2, shy3, shy4, shy5,
  clicked1, clicked2, clicked3, clicked4, clicked5, clicked6, clicked7,
  squirm1, squirm2, squirm3, squirm4, squirm5, squirm6,
  squirm7, squirm8, squirm9, squirm10, squirm11, squirm12,
  greet1, greet2, greet3, greet4, greet5, greet6, greet7, greet8,
  pout1, pout2, pout3, pout4, pout5, pout6,
  pout7, pout8, pout9, pout10, pout11, pout12,
} = window.DEEPSEEK_FRAMES;
petImage.src = idleOpen;
const pet = document.querySelector('#pet');
const zone = document.querySelector('#pet-zone');
const speech = document.querySelector('#speech');
const sparkles = document.querySelector('#sparkles');
const soundButton = document.querySelector('#sound');
const reaction = document.querySelector('#reaction');
const moodButtons = document.querySelectorAll('[data-mood]');

let messageTimer;
let dragging = false;
let moved = false;
let start = { x: 0, y: 0, left: 0, top: 0 };
let reactionTimer;
let interactionTimer;

const blinkSequence = [
  idleOpen, idleOpen, idleOpen, idleOpen,
  idleClosed,
  idleOpen, idleOpen, idleOpen, idleOpen,
  idleClosed, idleClosed,
  idleOpen, idleOpen, idleOpen,
];
let blinkTimer;
let blinkFrame = 0;
let playingInteraction = false;
let poutActive = false;
let recentClicks = [];
let greetingActive = false;
let greetingStopTimer;

const rapidClickLimit = 10;
const rapidClickWindow = 2000;
const greetingDuration = 5000;

const shySequence = [
  shy1, shy2, shy3, shy4, shy3, shy2,
  shy1, shy5, shy1, shy2, shy1, shy1,
  idleOpen, idleOpen,
];

const greetFrames = [
  greet1, greet2, greet3, greet4, greet5, greet6,
  greet7, greet8,
];

const poutSequence = [
  pout1, pout2, pout3, pout4, pout5, pout6,
  pout7, pout8, pout9, pout10, pout11, pout12,
];

const squirmSequence = [
  squirm1, squirm2, squirm3, squirm4, squirm5, squirm6,
  squirm7, squirm8, squirm9, squirm10, squirm11, squirm12,
];

function removeEdgeBackground(source) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);

      const frame = context.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = frame;
      const visited = new Uint8Array(canvas.width * canvas.height);
      const queue = [];
      const addPixel = (x, y) => {
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
        const pixel = y * canvas.width + x;
        if (visited[pixel]) return;
        visited[pixel] = 1;
        const offset = pixel * 4;
        if (data[offset] <= 18 && data[offset + 1] <= 18 && data[offset + 2] <= 18) {
          queue.push(pixel);
        }
      };

      for (let x = 0; x < canvas.width; x += 1) {
        addPixel(x, 0);
        addPixel(x, canvas.height - 1);
      }
      for (let y = 0; y < canvas.height; y += 1) {
        addPixel(0, y);
        addPixel(canvas.width - 1, y);
      }

      for (let index = 0; index < queue.length; index += 1) {
        const pixel = queue[index];
        data[pixel * 4 + 3] = 0;
        const x = pixel % canvas.width;
        const y = Math.floor(pixel / canvas.width);
        addPixel(x - 1, y);
        addPixel(x + 1, y);
        addPixel(x, y - 1);
        addPixel(x, y + 1);
      }

      context.putImageData(frame, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    image.src = source;
  });
}

// The supplied interaction frames were exported against opaque black. Clean
// only the dark area connected to their edges so dark character details remain.
const transparentSquirmFrames = Promise.all(squirmSequence.map(removeEdgeBackground));
const transparentPoutFrames = Promise.all(poutSequence.map(removeEdgeBackground));
const transparentGreetFrames = Promise.all(greetFrames.map(removeEdgeBackground))
  .then((frames) => [
    ...frames,
    ...frames.slice(1, -1).reverse(),
  ]);

const clickedSequence = [
  clicked1, clicked2, clicked3, clicked4, clicked5, clicked4,
  clicked6, clicked7, clicked6, clicked6, clicked6, clicked6,
  idleOpen, idleOpen,
];

function playSequence(sequence, frameDelay, returnDelay = 1100, onComplete) {
  if (playingInteraction || dragging) return;
  playingInteraction = true;
  clearTimeout(blinkTimer);
  clearTimeout(interactionTimer);
  let frame = 0;
  const next = () => {
    petImage.src = sequence[frame];
    frame += 1;
    if (frame < sequence.length) {
      interactionTimer = setTimeout(next, frameDelay);
    } else {
      petImage.src = idleOpen;
      playingInteraction = false;
      if (onComplete) {
        onComplete();
      } else {
        scheduleBlink(returnDelay);
      }
    }
  };
  next();
}

function playGreetingWave(frames) {
  if (!greetingActive) return;
  playSequence(frames, 90, 0, () => playGreetingWave(frames));
}

function stopGreeting(startIdle = false) {
  if (!greetingActive) return;
  greetingActive = false;
  clearTimeout(greetingStopTimer);
  cancelInteraction();
  if (startIdle) scheduleBlink(900);
}

async function playGreeting() {
  greetingActive = true;
  greetingStopTimer = setTimeout(() => stopGreeting(true), greetingDuration);
  say('Hi! I’m DeepSeek ♡', greetingDuration);
  const frames = await transparentGreetFrames;
  playGreetingWave(frames);
}

function playClickedReact() {
  const resumeGreeting = greetingActive;
  if (resumeGreeting) cancelInteraction();
  playSequence(clickedSequence, 74, 900, resumeGreeting
    ? () => transparentGreetFrames.then(playGreetingWave)
    : undefined);
}

async function playPout() {
  cancelInteraction();
  poutActive = true;
  pet.disabled = true;
  say('Hmph! Too many taps—give me a moment!', 2400);
  showReaction('😤');
  const frames = await transparentPoutFrames;
  playSequence(frames, 90, 0, () => {
    poutActive = false;
    pet.disabled = false;
    scheduleBlink(1200);
  });
}

function playShy() {
  playSequence(shySequence, 78);
}

function scheduleBlink(delay = 1800 + Math.random() * 2600) {
  clearTimeout(blinkTimer);
  blinkTimer = setTimeout(playBlink, delay);
}

function playBlink() {
  if (dragging || playingInteraction) {
    scheduleBlink(600);
    return;
  }
  petImage.src = blinkSequence[blinkFrame];
  blinkFrame += 1;
  if (blinkFrame < blinkSequence.length) {
    blinkTimer = setTimeout(playBlink, 72);
  } else {
    blinkFrame = 0;
    petImage.src = idleOpen;
    scheduleBlink();
  }
}

async function playSquirm() {
  const frames = await transparentSquirmFrames;
  if (!dragging) return;
  let frame = 0;
  const next = () => {
    if (!dragging) return;
    petImage.src = frames[frame];
    frame = (frame + 1) % frames.length;
    interactionTimer = setTimeout(next, 90);
  };
  next();
}

function cancelInteraction() {
  clearTimeout(interactionTimer);
  playingInteraction = false;
  petImage.src = idleOpen;
}

const randomReactions = [
  {
    name: 'clicked_react',
    play: playClickedReact,
    lines: ['Ah! You got me!', 'Hehe, that tickles!', 'Hello to you too!'],
    animation: 'is-petted',
    emoji: '✨',
    sparks: 6,
  },
  {
    name: 'blush_shy',
    play: playShy,
    lines: ['Oh... you noticed me ♡', 'You’re making me blush!', 'That was unexpectedly sweet...'],
    animation: 'is-love',
    emoji: '♡',
    sparks: 10,
  },
];

function showReaction(emoji) {
  reaction.textContent = emoji;
  reaction.classList.remove('show');
  void reaction.offsetWidth;
  reaction.classList.add('show');
  clearTimeout(reactionTimer);
  reactionTimer = setTimeout(() => reaction.classList.remove('show'), 1800);
}

function pickRandomReaction() {
  return randomReactions[Math.floor(Math.random() * randomReactions.length)];
}

function reactRandomly() {
  const choice = pickRandomReaction();
  const line = choice.lines[Math.floor(Math.random() * choice.lines.length)];
  showReaction(choice.emoji);
  say(line, 1900);
  animate(choice.animation);
  sparkle(choice.sparks);
  choice.play();
}

const moods = {
  happy: { emoji: '😊', line: 'Today is a good day!', animation: 'is-happy', sparks: 8 },
  love: { emoji: '🥰', line: 'You’re my favorite human ♡', animation: 'is-love', sparks: 14 },
  surprised: { emoji: '😮', line: 'Oh! You startled me!', animation: 'is-surprised', sparks: 5 },
  sleepy: { emoji: '😴', line: 'Five more minutes…', animation: 'is-sleepy', sparks: 3 },
};

function say(message, duration = 1500) {
  speech.textContent = message;
  speech.classList.add('show');
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => speech.classList.remove('show'), duration);
}

function animate(className) {
  pet.classList.remove('is-idle', 'is-petted', 'is-happy', 'is-love', 'is-surprised', 'is-sleepy');
  void pet.offsetWidth;
  pet.classList.add(className);
  pet.addEventListener('animationend', () => {
    pet.classList.remove(className);
    if (!dragging) pet.classList.add('is-idle');
  }, { once: true });
}

function react(name) {
  const mood = moods[name];
  showReaction(mood.emoji);
  say(mood.line, 1900);
  animate(mood.animation);
  sparkle(mood.sparks);
  if (name === 'love') playShy();
}

function sparkle(count = 7) {
  for (let i = 0; i < count; i += 1) {
    const star = document.createElement('span');
    star.className = 'spark';
    star.textContent = i % 3 ? '✦' : '♡';
    star.style.left = `${40 + Math.random() * 35}%`;
    star.style.top = `${28 + Math.random() * 35}%`;
    star.style.setProperty('--x', `${(Math.random() - .5) * 120}px`);
    star.style.setProperty('--y', `${-45 - Math.random() * 90}px`);
    sparkles.append(star);
    star.addEventListener('animationend', () => star.remove());
  }
}

pet.addEventListener('click', () => {
  stopGreeting();
  if (moved || poutActive) return;

  const now = Date.now();
  recentClicks = recentClicks.filter((clickedAt) => now - clickedAt <= rapidClickWindow);
  recentClicks.push(now);
  if (recentClicks.length >= rapidClickLimit) {
    recentClicks = [];
    playPout();
    return;
  }

  reactRandomly();
});

pet.addEventListener('dblclick', (event) => {
  event.preventDefault();
  if (poutActive) return;
  say('A treat?! Thank you! ♡', 2000);
  animate('is-happy');
  sparkle(12);
});

pet.addEventListener('pointerdown', (event) => {
  if (poutActive) {
    event.preventDefault();
    return;
  }
  dragging = true;
  moved = false;
  const box = zone.getBoundingClientRect();
  start = { x: event.clientX, y: event.clientY, left: box.left, top: box.top };
  pet.setPointerCapture(event.pointerId);
  clearTimeout(blinkTimer);
  cancelInteraction();
  playSquirm();
  pet.classList.remove('is-idle');
  pet.classList.add('is-dragging');
  say('Hey—hold on gently!', 1100);
});

pet.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  const dx = event.clientX - start.x;
  const dy = event.clientY - start.y;
  if (Math.hypot(dx, dy) > 5) moved = true;
  const maxLeft = innerWidth - zone.offsetWidth / 2;
  const maxTop = innerHeight - zone.offsetHeight / 2;
  zone.style.left = `${Math.max(zone.offsetWidth / 2, Math.min(maxLeft, start.left + zone.offsetWidth / 2 + dx))}px`;
  zone.style.top = `${Math.max(zone.offsetHeight / 2, Math.min(maxTop, start.top + zone.offsetHeight / 2 + dy))}px`;
});

function drop() {
  if (!dragging) return;
  dragging = false;
  cancelInteraction();
  pet.classList.remove('is-dragging');
  pet.classList.add('is-idle');
  if (moved) say('This spot is nice!', 1400);
  scheduleBlink(900);
  setTimeout(() => { moved = false; }, 50);
}

pet.addEventListener('pointerup', drop);
pet.addEventListener('pointercancel', drop);
pet.addEventListener('keydown', (event) => {
  if (poutActive) return;
  if (event.key === 'Enter' || event.key === ' ') sparkle(5);
});

soundButton.addEventListener('click', () => {
  const enabled = soundButton.getAttribute('aria-pressed') !== 'true';
  soundButton.setAttribute('aria-pressed', String(enabled));
  say(enabled ? 'Sound on ♪' : 'Quiet mode…');
});

moodButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (poutActive) return;
    react(button.dataset.mood);
    if (button.dataset.mood === 'surprised') playClickedReact();
  });
});

// Wave on entry until the character is clicked or the five-second limit passes.
playGreeting();
