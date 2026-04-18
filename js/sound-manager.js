class SoundManager {
  constructor() {
    this.enabled = localStorage.getItem('soundEnabled') !== 'false';
    this.audioContext = null;
    this.masterGain = null;
  }

  getAudioContext() {
    if (!this.audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.masterGain.gain.value = 0.25;
      }
    }
    return this.audioContext;
  }

  playTone(frequency, duration, type = 'sine') {
    if (!this.enabled) return;
    
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.9, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Звук недоступен');
    }
  }

  playSequence(frequencies, duration, interval) {
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, duration);
      }, i * interval);
    });
  }

  // WHEEK - писк морской свинки (характерный звук когда видит еду)
  wheekSound() {
    this.playSequence([800, 900], 0.25, 150);
    setTimeout(() => {
      this.playSequence([750, 850], 0.25, 150);
    }, 400);
  }

  // Урчание морской свинки (purring - когда довольна)
  purrSound() {
    this.playSequence([350, 320, 340, 330], 0.08, 60);
  }

  // Звук еды - хрумкание
  eatSound() {
    this.playSequence([400, 380, 420, 390], 0.1, 70);
  }

  // Звук счастья/игры - весёлые писки
  happySound() {
    this.playSequence([700, 800, 900, 850], 0.12, 80);
  }

  // Звук игры - энергичные писки
  playSound() {
    this.playSequence([750, 850, 950, 900, 800], 0.1, 100);
  }

  // Звук сна - низкое мурлыканье
  sleepSound() {
    this.playTone(280, 0.6, 'sine');
  }

  // Звук пробуждения - растягивающийся писк
  wakeSound() {
    this.playSequence([500, 600, 700, 600], 0.15, 100);
  }

  // Звук ласки - мягкое урчание
  petSound() {
    this.playSequence([300, 320, 310, 330], 0.12, 80);
  }

  // Звук испуга - пронзительный писк
  scaredSound() {
    this.playSequence([1000, 900, 1100], 0.08, 80);
  }

  // Грустный звук - печальный писк
  sadSound() {
    this.playSequence([400, 350, 300], 0.25, 150);
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled);
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

const soundManager = new SoundManager();
