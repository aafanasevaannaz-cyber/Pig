function update() {
  const state = petLogic.getState();
  const mood = petLogic.getMood();

  uiManager.updateStats(state);
  uiManager.updateMood(mood);
  uiManager.updateTime();
  uiManager.updateButtonStates(state);

  updatePetAnimation(state, mood);
}

function updatePetAnimation(state, mood) {
  const pet = document.getElementById('pet');

  pet.classList.remove('sleeping', 'excited', 'sad');

  if (state.isSleeping) {
    pet.classList.add('sleeping');
  } else if (state.happiness > 75) {
    pet.classList.add('excited');
  } else if (state.hunger > 80 || state.energy < 20) {
    pet.classList.add('sad');
  }
}

uiManager.setButtonClickHandlers({
  onFeed: () => {
    return petLogic.feed();
  },
  onPet: () => {
    return petLogic.pet();
  },
  onPlay: () => {
    return petLogic.play();
  },
  onSleep: () => {
    const state = petLogic.getState();
    if (state.isSleeping) {
      petLogic.wake();
      uiManager.playAnimation('bounce');
      uiManager.showFeedback('Доброе утро! ☀️');
    } else {
      petLogic.sleep();
      uiManager.playAnimation('sleeping');
      uiManager.showFeedback('Спокойной ночи... 😴');
    }
    update();
  }
});

uiManager.setPetClickHandler(() => {
  if (!petLogic.state.isSleeping) {
    const result = petLogic.pet();
    if (result) {
      uiManager.playAnimation('wiggle');
      uiManager.addHearts(1);
    }
  }
});

setInterval(update, 400);

const soundBtn = document.getElementById('soundToggle');
soundBtn.textContent = soundManager.isEnabled() ? '🔊' : '🔇';
soundBtn.style.opacity = soundManager.isEnabled() ? '1' : '0.5';

update();

console.log('🐷 Свинка-Дружок запущена!');
