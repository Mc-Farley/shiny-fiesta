const petImage = document.querySelector('#pet-image');
const {
  idleOpen, idleClosed, shy1, shy2, shy3, shy4, shy5,
  clicked1, clicked2, clicked3, clicked4, clicked5, clicked6, clicked7,
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

const shySequence = [
  shy1, shy2, shy3, shy4, shy3, shy2,
  shy1, shy5, shy1, shy2, shy1, shy1,
  idleOpen, idleOpen,
];

const clickedSequence = [
  clicked1, clicked2, clicked3, clicked4, clicked5, clicked4,
  clicked6, clicked7, clicked6, clicked6, clicked6, clicked6,
  idleOpen, idleOpen,
];

function playSequence(sequence, frameDelay, returnDelay = 1100) {
  if (playingInteraction || dragging) return;
  playingInteraction = true;
  clearTimeout(blinkTimer);
  let frame = 0;
  const next = () => {
    petImage.src = sequence[frame];
    frame += 1;
    if (frame < sequence.length) {
      blinkTimer = setTimeout(next, frameDelay);
    } else {
      petImage.src = idleOpen;
      playingInteraction = false;
      scheduleBlink(returnDelay);
    }
  };
  next();
}

function playClickedReact() {
  playSequence(clickedSequence, 74, 900);
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
  reaction.textContent = mood.emoji;
  reaction.classList.remove('show');
  void reaction.offsetWidth;
  reaction.classList.add('show');
  clearTimeout(reactionTimer);
  reactionTimer = setTimeout(() => reaction.classList.remove('show'), 1800);
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
  if (moved) return;
  say('Ah! You got me!', 1500);
  animate('is-petted');
  playClickedReact();
});

pet.addEventListener('dblclick', (event) => {
  event.preventDefault();
  say('A treat?! Thank you! ♡', 2000);
  animate('is-happy');
  sparkle(12);
});

pet.addEventListener('pointerdown', (event) => {
  dragging = true;
  moved = false;
  const box = zone.getBoundingClientRect();
  start = { x: event.clientX, y: event.clientY, left: box.left, top: box.top };
  pet.setPointerCapture(event.pointerId);
  clearTimeout(blinkTimer);
  petImage.src = idleOpen;
  pet.classList.remove('is-idle');
  pet.classList.add('is-dragging');
  say('Wheee—careful!', 900);
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
  pet.classList.remove('is-dragging');
  pet.classList.add('is-idle');
  if (moved) say('This spot is nice!', 1400);
  scheduleBlink(900);
  setTimeout(() => { moved = false; }, 50);
}

pet.addEventListener('pointerup', drop);
pet.addEventListener('pointercancel', drop);
pet.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') sparkle(5);
});

soundButton.addEventListener('click', () => {
  const enabled = soundButton.getAttribute('aria-pressed') !== 'true';
  soundButton.setAttribute('aria-pressed', String(enabled));
  say(enabled ? 'Sound on ♪' : 'Quiet mode…');
});

moodButtons.forEach((button) => {
  button.addEventListener('click', () => react(button.dataset.mood));
});

scheduleBlink(1200);
setTimeout(() => say('Hi! I’m DeepSeek ♡', 2200), 500);
