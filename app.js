const CONFIG = window.APP_CONFIG || {};

const state = {
  manual: false,
  scene: 'relax',
  hunger: 88,
  calm: 90,
  mood: 'спокойная',
  audioCtx: null,
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

const els = {
  root: document.getElementById('appRoot'),
  scene: document.querySelector('.scene-card'),
  pig: document.getElementById('pig'),
  pigArea: document.getElementById('pigArea'),
  statusPill: document.getElementById('statusPill'),
  ambientText: document.getElementById('ambientText'),
  hungerMeter: document.getElementById('hungerMeter'),
  calmMeter: document.getElementById('calmMeter'),
  miniNote: document.getElementById('miniNote'),
  watermark: document.getElementById('watermark'),
  title: document.querySelector('.title h1'),
  toggleModeBtn: document.getElementById('toggleModeBtn'),
  actionButtons: [...document.querySelectorAll('.action-btn')]
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function ensureAudio() {
  if (!state.audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    state.audioCtx = new AudioContextClass();
  }
  if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
  return state.audioCtx;
}

function chirp(freq = 320, duration = 0.14, type = 'sine', gainValue = 0.015, delay = 0) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.02);
}

function purrSound() {
  chirp(220, 0.16, 'triangle', 0.012, 0);
  chirp(240, 0.14, 'triangle', 0.011, 0.13);
  chirp(228, 0.15, 'triangle', 0.01, 0.28);
}

function wheekSound() {
  chirp(620, 0.08, 'sine', 0.016, 0);
  chirp(780, 0.1, 'sine', 0.016, 0.12);
}

function munchSound() {
  chirp(180, 0.04, 'square', 0.01, 0);
  chirp(165, 0.04, 'square', 0.01, 0.1);
  chirp(190, 0.05, 'square', 0.009, 0.2);
}

function sleepySound() {
  chirp(280, 0.22, 'sine', 0.007, 0);
  chirp(240, 0.18, 'sine', 0.005, 0.26);
}

function softVibe(pattern = [10]) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

function syncUi() {
  els.hungerMeter.style.width = `${state.hunger}%`;
  els.calmMeter.style.width = `${state.calm}%`;
  els.watermark.textContent = CONFIG.watermarkText || '';
  if (CONFIG.appTitle) {
    document.title = CONFIG.appTitle;
    els.title.textContent = CONFIG.appTitle;
  }
  els.toggleModeBtn.textContent = state.manual ? 'Ручной' : 'Авто';
  els.actionButtons.forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.scene === state.scene);
  });
}

function setScene(scene, userTriggered = false) {
  state.scene = scene;
  els.scene.className = 'scene-card';

  if (scene === 'pet') {
    els.scene.classList.add('is-pet');
    state.mood = 'довольная';
    state.calm = clamp(state.calm + 10, 0, 100);
    state.hunger = clamp(state.hunger - 2, 50, 100);
    els.statusPill.textContent = 'Гладишь — она урчит';
    els.ambientText.textContent = 'Тихое урчание и мягкий отклик.';
    els.miniNote.textContent = 'Любое состояние мягкое и полностью обратимое.';
    softVibe([10]);
    if (userTriggered) purrSound();
  }

  if (scene === 'feed') {
    els.scene.classList.add('is-feed');
    state.mood = 'хрумкает';
    state.hunger = 94;
    state.calm = clamp(state.calm + 4, 0, 100);
    els.statusPill.textContent = 'Сытая и довольная';
    els.ambientText.textContent = 'Хрумкает и шуршит рядом.';
    els.miniNote.textContent = 'По умолчанию свинка всегда в безопасной норме.';
    softVibe([10, 16, 10]);
    if (userTriggered) munchSound();
  }

  if (scene === 'hide') {
    els.scene.classList.add('is-hide');
    state.mood = 'в домике';
    state.calm = clamp(state.calm + 8, 0, 100);
    els.statusPill.textContent = 'Спряталась в домик';
    els.ambientText.textContent = 'Шуршит в укрытии и отдыхает.';
    els.miniNote.textContent = 'Домик — это отдых, а не проблема.';
  }

  if (scene === 'sleep') {
    els.scene.classList.add('is-sleep');
    state.mood = 'сонная';
    state.calm = clamp(state.calm + 12, 0, 100);
    state.hunger = clamp(state.hunger - 2, 50, 100);
    els.statusPill.textContent = 'Сопит тихонько';
    els.ambientText.textContent = 'Медленное дыхание и тёплая тишина.';
    els.miniNote.textContent = 'Здесь ничего не требует срочности.';
    if (userTriggered) sleepySound();
  }

  if (scene === 'happy') {
    els.scene.classList.add('is-happy');
    state.mood = 'радуется';
    state.hunger = clamp(state.hunger - 8, 48, 100);
    state.calm = clamp(state.calm + 6, 0, 100);
    els.statusPill.textContent = 'Милая радость';
    els.ambientText.textContent = 'Небольшой всплеск милоты и фирменный писк.';
    els.miniNote.textContent = 'Это дружок, а не питомец под обязанность.';
    softVibe([10, 22, 10]);
    if (userTriggered) wheekSound();
  }

  if (scene === 'relax') {
    state.mood = 'спокойная';
    state.calm = clamp(state.calm + 6, 0, 100);
    state.hunger = clamp(state.hunger - 2, 52, 100);
    els.statusPill.textContent = 'Спокойная и сытая';
    els.ambientText.textContent = 'Она тихо живёт рядом.';
    els.miniNote.textContent = 'По умолчанию всё хорошо. Здесь ничего не ломается.';
  }

  syncUi();
}

els.toggleModeBtn.addEventListener('click', () => {
  state.manual = !state.manual;
  syncUi();
});

els.pigArea.addEventListener('click', () => {
  state.manual = true;
  setScene('pet', true);
});

els.actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.manual = true;
    setScene(button.dataset.scene, true);
  });
});

function autoLoop() {
  if (state.manual) return;
  const options = state.hunger < 64
    ? ['feed', 'hide', 'sleep', 'pet', 'relax']
    : ['relax', 'pet', 'sleep', 'happy', 'hide'];

  setTimeout(() => {
    if (!state.manual) {
      const next = options[Math.floor(Math.random() * options.length)];
      setScene(next, false);
      autoLoop();
    }
  }, 6500 + Math.random() * 4200);
}

syncUi();
setScene('relax');
autoLoop();
