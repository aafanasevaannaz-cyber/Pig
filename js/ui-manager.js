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
      sleepBtn: document.getElementById('sleepBtn')
    };
  }

  updateStats(state) {
    const hunger = Math.max(0, 100 - state.hunger);
    const happiness = state.happiness;
    const energy = state.energy;

    this.elements.hungerBar.style.width = hunger + '%';
    this.elements.happinessBar.style.width = happiness + '%';
    this.elements.energyBar.style.width = energy + '%';

    this.elements.hungerValue.textContent = Math.round(hunger) + '%';
    this.elements.happinessValue.textContent = Math.round(happiness) + '%';
    this.elements.energyValue.textContent = Math.round(energy) + '%';
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
    this.elements.pet.classList.remove(
      'wiggle', 'bounce', 'spin', 'excited', 'sleeping', 'eating'
    );

    if (name) {
      void this.elements.pet.offsetWidth;
      this.elements.pet.classList.add(name);
    }
  }

  showFeedback(text, duration = 1500) {
    const prev = this.elements.statusText.textContent;
    this.elements.statusText.textContent = text;

    setTimeout(() => {
      this.elements.statusText.textContent = prev;
    }, duration);
  }

  addHearts() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = '50%';
    this.elements.pet.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
  }

  updateButtonStates(state) {
    this.elements.sleepBtn.textContent = state.isSleeping
      ? '⬆️ Проснуться'
      : '😴 Спать';
  }

  setButtonClickHandlers(callbacks) {
    this.elements.feedBtn.onclick = () => {
      callbacks.onFeed();
      this.playAnimation('eating');
    };

    this.elements.petBtn.onclick = () => {
      callbacks.onPet();
      this.playAnimation('wiggle');
      this.addHearts();
    };

    this.elements.playBtn.onclick = () => {
      callbacks.onPlay();
      this.playAnimation('bounce');
      this.addHearts();
    };

    this.elements.sleepBtn.onclick = () => {
      callbacks.onSleep();
    };
  }
}
