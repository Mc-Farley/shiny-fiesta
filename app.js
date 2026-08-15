const petImage = document.querySelector('#pet-image');
petImage.src = window.MIRA_PET_IMAGE;
const pet = document.querySelector('#pet');
const zone = document.querySelector('#pet-zone');
const speech = document.querySelector('#speech');
const sparkles = document.querySelector('#sparkles');
const soundButton = document.querySelector('#sound');
const reaction = document.querySelector('#reaction');
const moodButtons = document.querySelectorAll('[data-mood]');

const greetings = ['Hello there! ♡', 'That tickles!', 'Did you need me?', 'I’m awake… mostly.', 'Let’s be friends!'];
let messageTimer;
let dragging = false;
let moved = false;
let start = { x: 0, y: 0, left: 0, top: 0 };
let reactionTimer;

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
  say(greetings[Math.floor(Math.random() * greetings.length)]);
  animate('is-petted');
  sparkle(4);
  reaction.textContent = '♡';
  reaction.classList.add('show');
});

pet.addEventListener('dblclick', (event) => {
  event.preventDefault();
  say('A treat?! Thank you! ♡', 2000);
  animate('is-happy');
  sparkle(12);
  reaction.textContent = '🍰';
  reaction.classList.add('show');
});

pet.addEventListener('pointerdown', (event) => {
  dragging = true;
  moved = false;
  const box = zone.getBoundingClientRect();
  start = { x: event.clientX, y: event.clientY, left: box.left, top: box.top };
  pet.setPointerCapture(event.pointerId);
  pet.classList.remove('is-idle');
  pet.classList.add('is-dragging');
  say('Wheee—careful!', 900);
  reaction.textContent = '😮';
  reaction.classList.add('show');
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
  reaction.classList.remove('show');
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

setTimeout(() => say('Hi! I’m Mira ♡', 2200), 500);
