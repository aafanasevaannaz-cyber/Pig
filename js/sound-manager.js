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
        this.masterGain.gain.value = 0.3;
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
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.8, ctx.currentTime + duration);

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

  // Звук еды (хрумкание)
  eatSound() {
    this.playSequence([200, 220, 180], 0.1, 80);
  }

  // Звук счастья
  happySound() {
    this.playSequence([400, 500, 600], 0.15, 100);
  }

  // Звук игры
  playSound() {
    this.playSequence([600, 800, 1000], 0.1, 120);
  }

  // Звук сна
  sleepSound() {
    this.playTone(200, 0.5, 'sine');
  }

  // Звук пробуждения
  wakeSound() {
    this.playSequence([400, 600, 800], 0.1, 100);
  }

  // Звук нежности
  petSound() {
    this.playSequence([300, 350, 300], 0.15, 100);
  }

  // Грустный звук
  sadSound() {
    this.playSequence([300, 250, 200], 0.2, 150);
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
