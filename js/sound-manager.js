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
        this.masterGain.gain.value = 0.12;
      }
    }
    return this.audioContext;
  }

  playOsc(freq, duration, type, startTime, gainVal) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.85, startTime + duration);

    filter.type = 'highpass';
    filter.frequency.value = 800;

    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // WHEEK - самый реальный писк морской свинки
  wheekSound() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    this.playOsc(820, 0.22, 'triangle', now, 0.08);
    this.playOsc(950, 0.18, 'triangle', now + 0.25, 0.07);
    this.playOsc(780, 0.2, 'triangle', now + 0.48, 0.06);
  }

  // Урчание - как у настоящей морской свинки
  purrSound() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    [160, 170, 165, 175].forEach((f, i) => {
      this.playOsc(f, 0.09, 'sine', now + i * 0.1, 0.04);
    });
  }

  // Хрумкание - быстрые звуки еды
  eatSound() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    [420, 390, 430, 400].forEach((f, i) => {
      this.playOsc(f, 0.07, 'square', now + i * 0.09, 0.05);
    });
  }

  // Звук игры
  playSound() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    [680, 780, 920, 850, 720].forEach((f, i) => {
      this.playOsc(f, 0.1, 'triangle', now + i * 0.12, 0.06);
    });
  }

  // Сон - низкое мурлыканье
  sleepSound() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.7);

    filter.type = 'lowpass';
    filter.frequency.value = 250;

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  // Пробуждение
  wakeSound() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    [480, 640, 780, 620].forEach((f, i) => {
      this.playOsc(f, 0.12, 'triangle', now + i * 0.1, 0.05);
    });
  }

  // Ласка - мягкое урчание
  petSound() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    [190, 210, 200, 215].forEach((f, i) => {
      this.playOsc(f, 0.1, 'sine', now + i * 0.11, 0.035);
    });
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
