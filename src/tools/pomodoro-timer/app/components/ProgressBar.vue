<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore('pomodoro-store');

const progressWidth = computed({
  get() {
    return store.state.progressPercent;
  },
  set() {
    //
  },
});
</script>

<template>
  <div class="progress-bar">
    <div class="progress" :style="{ width: `${progressWidth}%` }" />
  </div>
</template>

<style scoped>
.progress-bar {
  width: 90%;
  height: 2.5rem;
  background-color: #eee;
  border-radius: 0.375rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
  border: 2px solid var(--pomodoro-app-accent-color);
}
.progress {
  width: 0;
  height: 100%;
  background-color: orange;
  border-radius: 0.25rem;
}
@media only screen and (max-width: 900px) {
  .progress {
    height: 1.3125rem;
  }
  .progress-bar {
    height: 1.5625rem;
  }
}
</style>
