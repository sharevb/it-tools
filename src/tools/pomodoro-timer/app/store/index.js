import { createStore } from 'vuex';
import { setAppAccentColor, setupNextTimerMode, startOver, startTimer, stopAlarms, stopTimer } from '../storeUtils.js';

export default createStore({
  state: {
    counter: '25:00',
    time: 0,
    workInterval: 25,
    shortBreak: 5,
    shortBreakCount: 3,
    longBreak: 30,
    isTimerRunning: false,
    isTimerInProgress: false,
    isShowFinishedPopup: false,
    isResetDropupVisible: false,
    isFirstVisit: true,
    prefersAlarmSound: false,
    progress: ['workInterval'],
    finishedMessage: '',
    appAccentColor: '#3b83b0',
    progressPercent: 0,
    currentTab: 'home',
  },
  mutations: {
    goToPage(state, payload) {
      state.currentTab = payload;
    },
    setInitialTimer(state) {
      setupNextTimerMode(state);
    },
    setFirstVisitStatus(state, payload) {
      state.isFirstVisit = payload.propValue;
    },
    updateTimeSetting(state, payload) {
      state[payload.propName] = payload.propValue;
      // eslint-disable-next-line no-unused-expressions
      state.isTimerInProgress ? {} : setupNextTimerMode(state);
    },
    updateAppColor(state, payload) {
      state[payload.propName] = payload.propValue;
      setAppAccentColor(payload.propValue);
    },
    toggleAlarmSound(state) {
      state.prefersAlarmSound = !state.prefersAlarmSound;
    },
    toggleTimer(state) {
      if (state.isTimerRunning) {
        stopTimer(state);
      } else {
        startTimer(state);
      }
    },
    toggleResetDropup(state) {
      state.isResetDropupVisible = !state.isResetDropupVisible;
    },
    setProgressBarPercent(state, payload) {
      state.progressPercent = payload.propValue;
    },
    prepareNextTimerMode(state) {
      stopAlarms();
      state.isShowFinishedPopup = false;
      setupNextTimerMode(state);
    },
    timerResetCurrent(state) {
      stopTimer(state);
      const currentMode = state.progress[state.progress.length - 1];
      this.commit('updateTimeSetting', { propName: currentMode, propValue: state[currentMode] });
      setupNextTimerMode(state);
      state.isResetDropupVisible = false;
    },
    timerResetAll(state) {
      startOver(state);
    },
    restoreDefaultSettings(state) {
      this.commit('updateTimeSetting', { propName: 'workInterval', propValue: 25 });
      this.commit('updateTimeSetting', { propName: 'shortBreak', propValue: 5 });
      this.commit('updateTimeSetting', { propName: 'shortBreakCount', propValue: 3 });
      this.commit('updateTimeSetting', { propName: 'longBreak', propValue: 30 });
      state.prefersAlarmSound = false;
      this.commit('updateAppColor', { propName: 'appAccentColor', propValue: '#3b83b0' });
    },
  },
  actions: {},
  modules: {},
});
