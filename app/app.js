const els = {
  scene: document.getElementById('scene'),
  bubble: document.getElementById('bubble'),
  modePill: document.getElementById('modePill'),
  moodLabel: document.getElementById('moodLabel'),
  hungerLabel: document.getElementById('hungerLabel'),
  controls: [...document.querySelectorAll('#controls .ctrl')],
  burst: document.getElementById('burst'),
  petWrap: document.getElementById('petWrap'),
  petHitbox: document.getElementById('petHitbox')
};

const state = {
  mode: 'relax',
  hunger: 0.12,
  calm: 0.92,
  joy: 0.58,
  sleepy: 0.18,
  blinkTimer: null
};

const modes = {
  relax: { bubble: 'я рядом', mood: 'спокойная', hunger: 'сытая', pill: 'Спокойная и сытая' },
  pet:   { bubble: 'нравится поглаживание', mood: 'довольная', hunger: 'сытая', pill: 'Гладишь — ей хорошо' },
  feed:  { bubble: 'радуется еде', mood: 'радуется', hunger: 'очень сытая', pill: 'Покормили — довольна' },
  house: { bubble: 'спряталась в домик', mood: 'в домике', hunger: 'сытая', pill: 'Домик и отдых' },
  sleep: { bubble: 'тихо засыпает', mood: 'сонная', hunger: 'сытая', pill: 'Сонный режим' },
  play:  { bubble: 'маленькая радость', mood: 'весёлая', hunger: 'чуть голодная', pill: 'Милая радость' }
};

function hearts(char = '❤') {
  els.burst.innerHTML = '';
  [[24, -26], [-18, -34], [-42, -14], [42, -16]].forEach(([x, y], i) => {
    const s = document.createElement('span');
    s.className = 'heart';
    s.textContent = char;
    s.style.left = '50%';
    s.style.top = '54%';
    s.style.setProperty('--x', x + 'px');
    s.style.setProperty('--y', y + 'px');
    s.style.animationDelay = i * 60 + 'ms';
    els.burst.appendChild(s);
  });
}

function wiggle() {
  if (els.scene.classList.contains('sleep')) return;
  els.petWrap.classList.remove('wiggle');
  void els.petWrap.offsetWidth;
  els.petWrap.classList.add('wiggle');
  setTimeout(() => els.petWrap.classList.remove('wiggle'), 340);
}

function bounce() {
  els.petWrap.classList.remove('jump');
  void els.petWrap.offsetWidth;
  els.petWrap.classList.add('jump');
  setTimeout(() => els.petWrap.classList.remove('jump'), 720);
}

function blink() {
  if (els.scene.classList.contains('house')) return;
  els.petWrap.classList.add('blink');
  setTimeout(() => els.petWrap.classList.remove('blink'), 160);
}

function scheduleBlink() {
  clearTimeout(state.blinkTimer);
  const next = els.scene.classList.contains('sleep') ? 2200 : 3200 + Math.random() * 2600;
  state.blinkTimer = setTimeout(() => {
    blink();
    scheduleBlink();
  }, next);
}

function setMode(mode) {
  state.mode = mode;
  els.scene.className = 'scene card ' + mode;
  const d = modes[mode];
  els.bubble.textContent = d.bubble;
  els.modePill.textContent = d.pill;
  els.moodLabel.textContent = d.mood;
  els.hungerLabel.textContent = d.hunger;
  els.controls.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));

  if (mode === 'pet') {
    hearts('❤');
    wiggle();
  }
  if (mode === 'feed') {
    hearts('✦');
    setTimeout(wiggle, 120);
  }
  if (mode === 'play') {
    hearts('✦');
    bounce();
  }
  if (mode === 'relax' || mode === 'house' || mode === 'sleep') {
    els.burst.innerHTML = '';
  }

  scheduleBlink();
}

els.controls.forEach(btn => btn.addEventListener('click', event => {
  event.stopPropagation();
  setMode(btn.dataset.mode);
}));

els.petHitbox.addEventListener('pointerdown', event => {
  event.preventDefault();
  setMode('pet');
});

['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => {
  els.petHitbox.addEventListener(ev, () => {
    setTimeout(() => {
      if (state.mode === 'pet') setMode('relax');
    }, 700);
  });
});

setMode('relax');
scheduleBlink();
setInterval(() => {
  if (!els.scene.classList.contains('sleep') && !els.scene.classList.contains('house')) {
    wiggle();
  }
}, 5200);
