<script setup>
import { useStore } from 'vuex';

const store = useStore('pomodoro-store');
</script>

<template>
  <span>{{ store.state.counter }}</span>
</template>

<style scoped>
span {
  font-family: 'Varela Round', 'Lucida Console', 'Courier New', Courier, monospace;
  font-size: 4rem;
}
</style>
