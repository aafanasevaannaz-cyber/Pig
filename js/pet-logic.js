class PetLogic {
  constructor() {
    this.state = {
      hunger: 80,
      happiness: 70,
      energy: 60,
      mood: 'спит',
      isAwake: false,
      isSleeping: true
    };

    this.moods = {
      sleeping: { text: 'спит', emoji: '😴', status: 'Свинка сладко спит...' },
      happy: { text: 'весёлая', emoji: '😄', status: 'Свинка радуется!' },
      hungry: { text: 'голодная', emoji: '😋', status: 'Свинка хочет кушать!' },
      tired: { text: 'устала', emoji: '😪', status: 'Свинке нужен отдых' },
      playful: { text: 'игривая', emoji: '🤩', status: 'Свинка хочет играть!' },
      calm: { text: 'спокойная', emoji: '😌', status: 'Свинка отдыхает...' }
    };

    this.startAutoUpdate();
  }

  getMood() {
    const h = this.state.hunger;
    const ha = this.state.happiness;
    const e = this.state.energy;

    if (this.state.isSleeping) return this.moods.sleeping;
    if (h > 70) return this.moods.hungry;
    if (e < 30) return this.moods.tired;
    if (ha > 80) return this.moods.playful;
    if (ha > 50) return this.moods.happy;
    return this.moods.calm;
  }

  feed() {
    this.state.hunger = Math.max(0, this.state.hunger - 30);
    this.state.happiness = Math.min(100, this.state.happiness + 10);
    this.state.energy = Math.max(0, this.state.energy - 10);
    return { action: 'feed', hungerReduced: true };
  }

  pet() {
    this.state.happiness = Math.min(100, this.state.happiness + 15);
    this.state.hunger = Math.min(100, this.state.hunger + 5);
    this.state.energy = Math.max(0, this.state.energy - 5);
    return { action: 'pet', happinessIncreased: true };
  }

  play() {
    this.state.happiness = Math.min(100, this.state.happiness + 25);
    this.state.hunger = Math.min(100, this.state.hunger + 15);
    this.state.energy = Math.max(0, this.state.energy - 20);
    return { action: 'play', excited: true };
  }

  sleep() {
    this.state.isSleeping = true;
    this.state.isAwake = false;
    this.state.energy = 100;
    this.state.happiness = Math.min(100, this.state.happiness + 5);
    return { action: 'sleep' };
  }

  wake() {
    this.state.isSleeping = false;
    this.state.isAwake = true;
    return { action: 'wake' };
  }

  autoUpdate() {
    if (this.state.isSleeping) {
      this.state.hunger = Math.min(100, this.state.hunger + 0.5);
      return;
    }

    this.state.hunger = Math.min(100, this.state.hunger + 1);
    this.state.energy = Math.max(0, this.state.energy - 0.8);
    this.state.happiness = Math.max(0, this.state.happiness - 0.5);

    if (this.state.hunger > 80) {
      this.state.happiness = Math.max(0, this.state.happiness - 1);
    }

    if (this.state.energy < 20) {
      this.state.happiness = Math.max(0, this.state.happiness - 2);
    }
  }

  startAutoUpdate() {
    setInterval(() => this.autoUpdate(), 2000);
  }

  getState() {
    return { ...this.state };
  }
}
