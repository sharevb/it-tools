<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const store = useStore('pomodoro-store');

const progress = computed({
  get() {
    return store.state.progress.length;
  },
  set() {
    //
  },
});
</script>

<template>
  <div class="icon-bar-root">
    <div class="icons-container">
      <template v-for="(shortBreakIndex) in Array.from({ length: store.state.shortBreakCount }, (_, i) => i)" :key="shortBreakIndex">
        <FontAwesomeIcon icon="fa-solid fa-computer" :class="{ active: progress === shortBreakIndex * 2 + 1, completed: progress > shortBreakIndex * 2 + 1 }" />
        <FontAwesomeIcon icon="fa-solid fa-mug-hot" :class="{ active: progress === shortBreakIndex * 2 + 2, completed: progress > shortBreakIndex * 2 + 2 }" />
      </template>
      <FontAwesomeIcon icon="fa-solid fa-computer" :class="{ active: progress === store.state.shortBreakCount * 2 + 1, completed: progress > store.state.shortBreakCount * 2 + 1 }" />
      <FontAwesomeIcon icon="fa-solid fa-person-walking" :class="{ active: progress === store.state.shortBreakCount * 2 + 2, completed: progress > store.state.shortBreakCount * 2 + 2 }" />
    </div>
  </div>
</template>

<style scoped>
.icon-bar-root{
    width: 90%;
}
.icons-container {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 1.875rem;
}
i {
    line-height: 28px;
    padding: 0.1875rem 0.3125rem;
    margin: 0 0.3125rem;
    color: lightgray;
    font-size: 1.375rem;
    border-radius: 0.5rem;
}
.active {
    color: var(--pomodoro-app-accent-color);
    box-shadow: orange 0 0 4px 5px;
}
.completed {
    color: var(--pomodoro-app-accent-color);
}
@media only screen and (min-width: 900px) {
    i {
        line-height: 2.5rem;
        font-size: 2.125rem;
    }
}
</style>
