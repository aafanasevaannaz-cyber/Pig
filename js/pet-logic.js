class PetLogic {
  constructor() {
    this.loadState();
    
    this.moods = {
      sleeping: { text: 'спит', emoji: '😴', status: 'Свинка спит... Zzz' },
      veryHappy: { text: 'восторг', emoji: '🤩', status: 'Свинка прыгает от радости!' },
      happy: { text: 'довольна', emoji: '😊', status: 'Свинка счастлива!' },
      playful: { text: 'игривая', emoji: '🎾', status: 'Свинка хочет играть!' },
      calm: { text: 'спокойна', emoji: '😌', status: 'Свинка отдыхает...' },
      hungry: { text: 'голодна', emoji: '😋', status: 'Свинка хочет кушать!' },
      veryHungry: { text: 'очень голодна', emoji: '🤤', status: 'Свинка очень голодна!' },
      tired: { text: 'устала', emoji: '😪', status: 'Свинке нужен отдых' },
      veryTired: { text: 'очень устала', emoji: '💤', status: 'Свинка падает с ног!' }
    };

    this.startAutoUpdate();
  }

  loadState() {
    const saved = localStorage.getItem('pigState');
    if (saved) {
      this.state = JSON.parse(saved);
    } else {
      this.state = {
        hunger: 30,
        happiness: 70,
        energy: 80,
        isAwake: true,
        isSleeping: false,
        lastAction: null,
        createdAt: Date.now()
      };
    }
  }

  saveState() {
    localStorage.setItem('pigState', JSON.stringify(this.state));
  }

  getMood() {
    const { hunger, happiness, energy, isSleeping } = this.state;

    if (isSleeping) return this.moods.sleeping;
    if (hunger > 85) return this.moods.veryHungry;
    if (hunger > 65) return this.moods.hungry;
    if (energy < 20) return this.moods.veryTired;
    if (energy < 40) return this.moods.tired;
    if (happiness > 85) return this.moods.veryHappy;
    if (happiness > 65) return this.moods.playful;
    if (happiness > 50) return this.moods.happy;
    return this.moods.calm;
  }

  feed() {
    if (this.state.isSleeping) return null;
    
    this.state.hunger = Math.max(0, this.state.hunger - 35);
    this.state.happiness = Math.min(100, this.state.happiness + 8);
    this.state.energy = Math.max(0, this.state.energy - 8);
    this.state.lastAction = 'feed';
    
    soundManager.eatSound();
    this.saveState();
    
    return { action: 'feed', emoji: '🍎' };
  }

  pet() {
    if (this.state.isSleeping) return null;
    
    this.state.happiness = Math.min(100, this.state.happiness + 12);
    this.state.energy = Math.max(0, this.state.energy - 5);
    this.state.hunger = Math.min(100, this.state.hunger + 3);
    this.state.lastAction = 'pet';
    
    soundManager.petSound();
    this.saveState();
    
    return { action: 'pet', emoji: '🎀' };
  }

  play() {
    if (this.state.isSleeping) return null;
    
    this.state.happiness = Math.min(100, this.state.happiness + 20);
    this.state.energy = Math.max(0, this.state.energy - 25);
    this.state.hunger = Math.min(100, this.state.hunger + 12);
    this.state.lastAction = 'play';
    
    soundManager.playSound();
    this.saveState();
    
    return { action: 'play', emoji: '🎾' };
  }

  sleep() {
    this.state.isSleeping = true;
    this.state.isAwake = false;
    this.state.energy = 100;
    this.state.lastAction = 'sleep';
    
    soundManager.sleepSound();
    this.saveState();
    
    return { action: 'sleep' };
  }

  wake() {
    this.state.isSleeping = false;
    this.state.isAwake = true;
    this.state.lastAction = 'wake';
    
    soundManager.wakeSound();
    this.saveState();
    
    return { action: 'wake' };
  }

  autoUpdate() {
    if (this.state.isSleeping) {
      this.state.hunger = Math.min(100, this.state.hunger + 0.3);
      this.state.happiness = Math.min(100, this.state.happiness + 0.2);
      return;
    }

    this.state.hunger = Math.min(100, this.state.hunger + 0.8);
    this.state.energy = Math.max(0, this.state.energy - 0.6);

    if (this.state.hunger > 70) {
      this.state.happiness = Math.max(0, this.state.happiness - 0.8);
    }

    if (this.state.energy < 30) {
      this.state.happiness = Math.max(0, this.state.happiness - 1.2);
    }

    this.saveState();
  }

  startAutoUpdate() {
    setInterval(() => this.autoUpdate(), 1500);
  }

  reset() {
    localStorage.removeItem('pigState');
    location.reload();
  }

  getState() {
    return { ...this.state };
  }

  getAge() {
    const ageMs = Date.now() - this.state.createdAt;
    const minutes = Math.floor(ageMs / 60000);
    return minutes;
  }
}

const petLogic = new PetLogic();
