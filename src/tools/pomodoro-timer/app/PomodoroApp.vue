<script setup>
import { useStore } from 'vuex';
import Header from './components/Header.vue';
import FinishedPopup from './components/FinishedPopup.vue';
import { startTimer } from './storeUtils';
import PomodoroAbout from './views/PomodoroAbout.vue';
import PomodoroHome from './views/Home.vue';
import PomodoroSettings from './views/Settings.vue';

const store = useStore('pomodoro-store');

// Save state on visibilitychange
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    localStorage.setItem('pomodoro-state', JSON.stringify(store.state));
  }
});

// Save state on mutation
function subscribeToSavingState() {
  store.subscribe((mutation, state) => {
    localStorage.setItem('pomodoro-state', JSON.stringify(state));
  });
}

// Restore state on load
function restoreStateIfAvaiable() {
  if (localStorage.getItem('pomodoro-state')) {
    store.replaceState(
      Object.assign(store.state, JSON.parse(localStorage.getItem('pomodoro-state'))),
    );
    store.commit('updateAppColor', {
      propName: 'appAccentColor',
      propValue: store.state.appAccentColor,
    });
  }
  if (store.state.isTimerRunning) {
    startTimer(store.state);
  }
}

// Run these on start up
subscribeToSavingState();
restoreStateIfAvaiable();

function isWorkIntervalSet() {
  return store.state.workInterval;
}

if (isWorkIntervalSet()) {
  store.commit('goToPage', 'home');
}
else {
  store.commit('goToPage', 'settings');
}

const currentTab = computed(
  {
    get() {
      return store.state.currentTab;
    },
    set(newPage) {
      store.commit('goToPage', newPage);
    },
  },
);
</script>

<template>
  <link href="//fonts.googleapis.com/css2?family=Varela+Round&display=swap" rel="stylesheet">
  <div class="pomodoro-timer-app">
    <Header />
    <div class="page-container">
      <n-tabs v-model:value="currentTab" type="line" animated>
        <n-tab-pane name="home" :tab="t('tools.pomodoro-timer.PomodoroApp.text.timer')">
          <PomodoroHome />
        </n-tab-pane>
        <n-tab-pane name="about" :tab="t('tools.pomodoro-timer.PomodoroApp.text.about')">
          <PomodoroAbout />
        </n-tab-pane>
        <n-tab-pane name="settings" :tab="t('tools.pomodoro-timer.PomodoroApp.text.settings')">
          <PomodoroSettings />
        </n-tab-pane>
      </n-tabs>
    </div>
    <!-- <Footer /> -->
    <FinishedPopup />
    <audio id="alarmPlayer" src="/Beep.mp3" loop />
  </div>
</template>

<style>
@import url("//fonts.googleapis.com/css2?family=Varela+Round&display=swap");

:root {
    --pomodoro-app-accent-color: #3b83b0;
    --pomodoro-dark-text-color: #303030;
    --pomodoro-light-gray-text-color: #767676;
    --pomodoro-text-contrast-color: #ffffff;
}

.pomodoro-timer-app *,
.pomodoro-timer-app *::before,
.pomodoro-timer-app *::after {
    box-sizing: border-box;
}

.pomodoro-timer-app {
  -webkit-text-size-adjust: 100%;
  font-size: 1rem;
    font-family: "Varela Round", -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
        sans-serif;
    color: var(--pomodoro-dark-text-color);
    min-height: 100vh;
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.pomodoro-timer-app input,
.pomodoro-timer-app textarea,
.pomodoro-timer-app button {
    font: inherit;
}

.pomodoro-timer-app button {
    outline: none !important;
    border-style: none;
    border: white 0.0625rem solid;
    box-shadow: 1px 1px 7px -4px black;
    font-size: 1.125rem;
    border-radius: 0.375rem;
    background-color: var(--pomodoro-app-accent-color);
    color: var(--pomodoro-text-contrast-color);
    padding: 10px 15px 9px 15px;
    cursor: pointer;
    text-align: center;
}

.pomodoro-timer-app a {
    color: var(--pomodoro-app-accent-color);
}

.pomodoro-timer-app .settings-label {
    display: inline-block;
    width: 12.5rem;
    padding: 0.625rem 0rem;
}

.pomodoro-timer-app .page-container {
    flex: 1;
    display: flex;
    justify-content: center;
}
</style>
