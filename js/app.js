const petLogic = new PetLogic();
const uiManager = new UIManager();

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

  pet.classList.remove('sleeping', 'excited');

  if (state.isSleeping) {
    pet.classList.add('sleeping');
  } else if (state.happiness > 75) {
    pet.classList.add('excited');
  }
}

uiManager.setButtonClickHandlers({
  onFeed: () => {
    petLogic.feed();
    uiManager.showFeedback('Ммм, спасибо! 😋');
    update();
  },
  onPet: () => {
    if (petLogic.state.isSleeping) return;
    petLogic.pet();
    uiManager.showFeedback('Мне приятно! 😄');
    update();
  },
  onPlay: () => {
    if (petLogic.state.isSleeping) return;
    petLogic.play();
    uiManager.showFeedback('Ура, играем! 🎾');
    update();
  },
  onSleep: () => {
    if (petLogic.state.isSleeping) {
      petLogic.wake();
      uiManager.showFeedback('Доброе утро! ☀️');
    } else {
      petLogic.sleep();
      uiManager.showFeedback('Спокойной ночи... 😴');
    }
    update();
  }
});

setInterval(update, 500);
update();
