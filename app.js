'use strict';

const SHAPES = [
  { id: 'hringur', label: 'Hringur', svg: '<circle cx="50" cy="50" r="44" class="shape-fill"/>' },
  { id: 'ferhyrningur', label: 'Ferhyrningur', svg: '<rect x="6" y="6" width="88" height="88" rx="8" class="shape-fill"/>' },
  { id: 'thrihyrningur', label: 'Þríhyrningur', svg: '<polygon points="50,5 95,93 5,93" class="shape-fill"/>' },
  { id: 'stjarna', label: 'Stjarna', svg: '<polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" class="shape-fill"/>' },
  { id: 'demant', label: 'Demant', svg: '<polygon points="50,4 96,50 50,96 4,50" class="shape-fill"/>' },
  { id: 'hjarta', label: 'Hjarta', svg: '<path d="M50,75 C50,75 10,52 10,30 C10,18 20,10 30,10 C37,10 44,14 50,22 C56,14 63,10 70,10 C80,10 90,18 90,30 C90,52 50,75 50,75 Z" class="shape-fill"/>' },
  { id: 'sexhyrningur', label: 'Sexhyrningur', svg: '<polygon points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" class="shape-fill"/>' },
  { id: 'plus', label: 'Plús', svg: '<path d="M36,6 L64,6 L64,36 L94,36 L94,64 L64,64 L64,94 L36,94 L36,64 L6,64 L6,36 L36,36 Z" class="shape-fill"/>' }
];

const TOTAL = 20;

let questions = [];
let idx = 0;
let score = 0;
let locked = false;
let gameMode = 'random';

const screens = {
  start: document.getElementById('start-screen'),
  game: document.getElementById('game-screen'),
  end: document.getElementById('end-screen')
};

const progressEl = document.getElementById('progress-text');
const scoreEl = document.getElementById('score-text');
const shapeLeft = document.getElementById('shape-left');
const shapeRight = document.getElementById('shape-right');
const replayBtn = document.getElementById('replay-btn');
const menuBtn = document.getElementById('menu-btn');
const restartBtn = document.getElementById('restart-btn');
const finalEl = document.getElementById('final-score-text');

let icelandicVoice = null;

function loadVoices() {
  if (!window.speechSynthesis) return;
  const voices = speechSynthesis.getVoices();
  icelandicVoice = voices.find(v => /^is\b/i.test(v.lang)) || null;
}

if (window.speechSynthesis) {
  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

function speak(text) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'is-IS';
  u.rate = 0.85;
  u.pitch = 1.0;
  if (icelandicVoice) u.voice = icelandicVoice;
  speechSynthesis.speak(u);
}

function randInt(lo, hi) {
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function scaleFactor() {
  const vw = window.innerWidth;
  if (vw < 380) return 0.52;
  if (vw < 480) return 0.65;
  if (vw < 600) return 0.78;
  return 1.0;
}

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle('active', key === name);
  });
}

function buildQuestions() {
  const pool = [...SHAPES, ...SHAPES, ...SHAPES]
    .sort(() => Math.random() - 0.5)
    .slice(0, TOTAL);

  return pool.map((shape, index) => {
    if (gameMode === 'random') {
      return {
        shape,
        correct: Math.random() < 0.5 ? 'big' : 'small',
        bigLeft: Math.random() < 0.5,
        bigPx: randInt(160, 200),
        smallPx: randInt(90, 120)
      };
    } else if (gameMode === 'big-only') {
      return {
        shape,
        correct: 'big',
        bigLeft: Math.random() < 0.5,
        bigPx: randInt(160, 200),
        smallPx: randInt(90, 120)
      };
    } else if (gameMode === 'small-only') {
      return {
        shape,
        correct: 'small',
        bigLeft: Math.random() < 0.5,
        bigPx: randInt(160, 200),
        smallPx: randInt(90, 120)
      };
    } else if (gameMode === 'alternating') {
      const isEven = index % 2 === 0;
      return {
        shape,
        correct: isEven ? 'big' : 'small',
        bigLeft: Math.random() < 0.5,
        bigPx: randInt(160, 200),
        smallPx: randInt(90, 120)
      };
    }
  });
}

function makeSVG(shape, px) {
  return `<svg viewBox="0 0 100 100" width="${px}" height="${px}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${shape.svg}</svg>`;
}

function renderQuestion() {
  locked = false;

  const q = questions[idx];
  const scale = scaleFactor();

  const bigPx = Math.round(q.bigPx * scale);
  const smallPx = Math.round(q.smallPx * scale);

  progressEl.textContent = `Spurning ${idx + 1}/${TOTAL}`;
  scoreEl.textContent = `Stig: ${score}`;

  const leftPx = q.bigLeft ? bigPx : smallPx;
  const rightPx = q.bigLeft ? smallPx : bigPx;
  const leftType = q.bigLeft ? 'big' : 'small';
  const rightType = q.bigLeft ? 'small' : 'big';

  shapeLeft.innerHTML = makeSVG(q.shape, leftPx);
  shapeLeft.dataset.type = leftType;
  shapeLeft.className = 'shape-card';

  shapeRight.innerHTML = makeSVG(q.shape, rightPx);
  shapeRight.dataset.type = rightType;
  shapeRight.className = 'shape-card';

  const pad = 32;
  shapeLeft.style.minWidth = shapeLeft.style.minHeight = (leftPx + pad) + 'px';
  shapeRight.style.minWidth = shapeRight.style.minHeight = (rightPx + pad) + 'px';

  shapeLeft.disabled = false;
  shapeRight.disabled = false;

  speak(q.correct === 'big' ? 'stór' : 'lítill');
}

function answer(card) {
  if (locked) return;
  locked = true;

  shapeLeft.disabled = true;
  shapeRight.disabled = true;

  const q = questions[idx];
  const correct = card.dataset.type === q.correct;

  if (correct) {
    score++;
    card.classList.add('correct');
  } else {
    card.classList.add('incorrect');
  }

  scoreEl.textContent = `Stig: ${score}`;

  setTimeout(() => {
    idx++;
    if (idx >= TOTAL) {
      finalEl.textContent = `Þú fékkst ${score} af ${TOTAL} rétt! 🎊`;
      showScreen('end');
    } else {
      renderQuestion();
    }
  }, randInt(700, 1200));
}

function startGame() {
  questions = buildQuestions();
  idx = 0;
  score = 0;
  showScreen('game');
  renderQuestion();
}

// Event listeners
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    gameMode = e.currentTarget.dataset.mode;
    startGame();
  });
});

menuBtn.addEventListener('click', () => {
  showScreen('start');
});

restartBtn.addEventListener('click', () => {
  showScreen('start');
});

replayBtn.addEventListener('click', () => {
  if (idx < TOTAL) {
    const q = questions[idx];
    speak(q.correct === 'big' ? 'stór' : 'lítill');
  }
});

shapeLeft.addEventListener('click', () => answer(shapeLeft));
shapeRight.addEventListener('click', () => answer(shapeRight));
