class UIManager {
  constructor() {
    this.elements = {
      pet: document.getElementById('pet'),
      statusText: document.getElementById('statusText'),
      emotion: document.getElementById('emotion'),
      hungerBar: document.getElementById('hungerBar'),
      happinessBar: document.getElementById('happinessBar'),
      energyBar: document.getElementById('energyBar'),
      hungerValue: document.getElementById('hungerValue'),
      happinessValue: document.getElementById('happinessValue'),
      energyValue: document.getElementById('energyValue'),
      moodText: document.getElementById('moodText'),
      timeText: document.getElementById('timeText'),
      feedBtn: document.getElementById('feedBtn'),
      playBtn: document.getElementById('playBtn'),
      petBtn: document.getElementById('petBtn'),
      sleepBtn: document.getElementById('sleepBtn'),
      soundToggle: document.getElementById('soundToggle'),
      resetBtn: document.getElementById('resetBtn')
    };

    this.heartCount = 0;
    this.initEventListeners();
  }

  initEventListeners() {
    this.elements.soundToggle.addEventListener('click', () => {
      const enabled = soundManager.toggleSound();
      this.elements.soundToggle.textContent = enabled ? '🔊' : '🔇';
      this.elements.soundToggle.style.opacity = enabled ? '1' : '0.5';
    });

    this.elements.resetBtn.addEventListener('click', () => {
      if (confirm('Вы уверены? Морская свинка будет забыта!')) {
        petLogic.reset();
      }
    });
  }

  updateStats(state) {
    const hungerPercent = Math.max(0, 100 - state.hunger);
    const happinessPercent = state.happiness;
    const energyPercent = state.energy;

    this.updateBar(this.elements.hungerBar, hungerPercent);
    this.updateBar(this.elements.happinessBar, happinessPercent);
    this.updateBar(this.elements.energyBar, energyPercent);

    this.elements.hungerValue.textContent = Math.round(hungerPercent) + '%';
    this.elements.happinessValue.textContent = Math.round(happinessPercent) + '%';
    this.elements.energyValue.textContent = Math.round(energyPercent) + '%';
  }

  updateBar(element, value) {
    element.style.width = Math.min(100, Math.max(0, value)) + '%';
  }

  updateMood(mood) {
    this.elements.statusText.textContent = mood.status;
    this.elements.emotion.textContent = mood.emoji;
    this.elements.moodText.textContent = mood.text;
  }

  updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.elements.timeText.textContent = hours + ':' + minutes;
  }

  playAnimation(name) {
    const pet = this.elements.pet;
    pet.classList.remove(
      'wiggle', 'bounce', 'spin', 'excited', 'sleeping', 'eating', 'nod'
    );

    if (name) {
      void pet.offsetWidth;
      pet.classList.add(name);
    }
  }

  showFeedback(text, duration = 1200) {
    const prev = this.elements.statusText.textContent;
    this.elements.statusText.textContent = text;

    setTimeout(() => {
      this.elements.statusText.textContent = prev;
    }, duration);
  }

  addHearts(count = 3) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        heart.style.left = (30 + Math.random() * 40) + '%';
        heart.style.top = '50%';
        this.elements.pet.appendChild(heart);

        setTimeout(() => heart.remove(), 1000);
      }, i * 100);
    }
  }

  addSparkles(count = 4) {
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.textContent = '✨';
      sparkle.style.left = (25 + Math.random() * 50) + '%';
      sparkle.style.top = (20 + Math.random() * 40) + '%';
      this.elements.pet.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 800);
    }
  }

  addBubbles(text) {
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.textContent = text;
    this.elements.pet.appendChild(bubble);

    setTimeout(() => bubble.remove(), 2000);
  }

  updateButtonStates(state) {
    const btnText = state.isSleeping ? '⬆️ Проснуться' : '😴 Спать';
    this.elements.sleepBtn.textContent = btnText;

    const buttonsDisabled = state.isSleeping;
    this.elements.feedBtn.disabled = buttonsDisabled;
    this.elements.petBtn.disabled = buttonsDisabled;
    this.elements.playBtn.disabled = buttonsDisabled;

    if (buttonsDisabled) {
      this.elements.feedBtn.style.opacity = '0.5';
      this.elements.petBtn.style.opacity = '0.5';
      this.elements.playBtn.style.opacity = '0.5';
    } else {
      this.elements.feedBtn.style.opacity = '1';
      this.elements.petBtn.style.opacity = '1';
      this.elements.playBtn.style.opacity = '1';
    }
  }

  setButtonClickHandlers(callbacks) {
    this.elements.feedBtn.onclick = () => {
      const result = callbacks.onFeed();
      if (result) {
        this.playAnimation('eating');
        this.showFeedback('WHEEK WHEEK! 🍎');
        this.addBubbles('Ням-ням!');
      }
    };

    this.elements.petBtn.onclick = () => {
      const result = callbacks.onPet();
      if (result) {
        this.playAnimation('wiggle');
        this.showFeedback('Мур-мур! 😌');
        this.addHearts(2);
      }
    };

    this.elements.playBtn.onclick = () => {
      const result = callbacks.onPlay();
      if (result) {
        this.playAnimation('bounce');
        this.showFeedback('Wheek wheek wheek! 🎾');
        this.addHearts(3);
        this.addSparkles(4);
      }
    };

    this.elements.sleepBtn.onclick = () => {
      callbacks.onSleep();
    };
  }

  setPetClickHandler(callback) {
    this.elements.pet.onclick = (e) => {
      if (e.target === this.elements.pet) {
        callback();
      }
    };
  }
}

const uiManager = new UIManager();
