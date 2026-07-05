function el(idString) {
  return document.getElementById(idString);
}

function msToString(ms) {
  return new Date(ms).toISOString().slice(14, 19);
}

let titleInterval = null;
function startTitleAlarm(str, delay) {
  titleInterval = setInterval(() => {
    document.title.startsWith('⏰')
      ? document.title = `${str} - IT Tools`
      : document.title = '⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰' + ' - IT Tools';
  }, delay);
}

function stopTitleAlarm() {
  // eslint-disable-next-line no-alert
  titleInterval ? clearInterval(titleInterval) : alert('Error:  something went wrong when trying to stop the title alarm.');
  document.title = 'Pomodoro Timer - IT Tools';
}

function getNextTimerMode(state) {
  const currentMode = state.progress[state.progress.length - 1];
  if (currentMode === 'workInterval') {
    return state.progress.length === state.shortBreakCount * 2 + 1 ? 'longBreak' : 'shortBreak';
  }
  else {
    return 'workInterval';
  }
}

function formatModeToText(mode) {
  if (mode === 'workInterval') {
    return 'work interval';
  }
  if (mode === 'shortBreak') {
    return 'short break';
  }
  if (mode === 'longBreak') {
    return 'long break';
  }
}

function getAlarmText(nextMode) {
  if (nextMode === 'workInterval') {
    return 'Work Time';
  }
  if (nextMode === 'shortBreak') {
    return 'Short Break Time';
  }
  if (nextMode === 'longBreak') {
    return 'Long Break Time';
  }
}

function startOver(state) {
  stopTimer(state);
  state.isTimerInProgress = false;
  state.progress = ['workInterval'];
  setupNextTimerMode(state);
  state.isResetDropupVisible = false;
}

function onTimerFinished(state, alarmPlayer) {
  state.counter = '00:00';
  state.time = 0;
  state.progressPercent = 100;

  const oldMode = state.progress[state.progress.length - 1];
  const newMode = getNextTimerMode(state);
  state.progress.push(newMode);

  const oldModeText = formatModeToText(oldMode);
  const newModeText = formatModeToText(newMode);
  state.finishedMessage = `The ${oldModeText} timer has finished. Next up is a ${newModeText}.`;
  state.isShowFinishedPopup = true;

  const titleText = getAlarmText(newMode);
  startTitleAlarm(titleText, 500);
  if (state.prefersAlarmSound) {
    alarmPlayer.play();
  }

  stopTimer(state);
}

function setupNextTimerMode(state) {
  if (state.progress.length === state.shortBreakCount * 2 + 2) {
    startOver(state);
  }
  else {
    const timerMode = state.progress[state.progress.length - 1];
    state.time = state[timerMode] * 60000;
    state.counter = msToString(state.time);
    state.progressPercent = 0;
  }
}

function stopAlarms() {
  el('alarmPlayer').pause();
  stopTitleAlarm();
}

let timerInterval = null;
function startTimer(state) {
  state.isTimerRunning = true;
  state.isTimerInProgress = true;
  const timerMode = state.progress[state.progress.length - 1];
  const totalModeTime = state[timerMode] * 60000;
  const remainingTime = state.time;
  const startTime = Date.now();
  timerInterval = setInterval(() => {
    const timeElapsed = Date.now() - startTime;
    const newRemainingTime = remainingTime - timeElapsed;
    if (newRemainingTime <= 0) {
      onTimerFinished(state, el('alarmPlayer'));
      return;
    }
    state.time = newRemainingTime;
    state.counter = msToString(newRemainingTime);
    state.progressPercent = (totalModeTime - newRemainingTime) / totalModeTime * 100;
  }, 200);
}

function stopTimer(state) {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  state.isTimerRunning = false;
}

function setAppAccentColor(hexColor) {
  const root = document.querySelector(':root');
  root.style.setProperty('--pomodoro-app-accent-color', hexColor);
}

export {
  startTimer,
  stopTimer,
  startOver,
  setupNextTimerMode,
  stopAlarms,
  setAppAccentColor,
};
