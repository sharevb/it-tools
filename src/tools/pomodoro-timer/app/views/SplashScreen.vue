<script setup>
const store = useStore('pomodoro-store');

const { t } = useI18n();

function goToHomeOrSettings() {
  if (isWorkIntervalSet()) {
    store.commit('goToHome');
  }
  else {
    store.commit('goToSettings');
  }
}

setTimeout(() => {
  goToHomeOrSettings();
}, 2000);
</script>

<template>
  <div class="splash-screen">
    <p class="splash-title">
      {{ t('tools.pomodoro-timer.SplashScreen.text.pomodoro-timer-0') }}
    </p>
    <p class="splash-loader">
      {{ t('tools.pomodoro-timer.SplashScreen.text.loading-0') }}
    </p>
  </div>
</template>

<style scoped>
.splash-screen {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: var(--pomodoro-app-accent-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
}
.splash-title {
    font-size: 2.5rem;
}
.splash-loader {
    font-size: 1.25rem;
}
</style>
