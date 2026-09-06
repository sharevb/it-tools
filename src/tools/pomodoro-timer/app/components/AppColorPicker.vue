<script setup>
import { useStore } from 'vuex';

const props = defineProps({
  id: String,
  label: String,
});

const store = useStore('pomodoro-store');

function setColor(hexColor) {
  store.commit('updateAppColor', { propName: props.id, propValue: hexColor });
}
</script>

<template>
  <label :for="id" class="settings-label">{{ label }}</label>
  <div class="dot-container">
    <div class="blue-dot" @click="setColor('#3b83b0')" />
    <div class="red-dot" @click="setColor('#c93232')" />
    <div class="green-dot" @click="setColor('#008000')" />
  </div>
</template>

<style scoped>
.dot-container {
  display: inline-block;
}
.dot-container > div {
  display: inline-block;
  border-radius: 50%;
  width: 1.875rem;
  height: 1.875rem;
  margin-right: 0.3125rem;
}

.blue-dot {
  background-color: #3b83b0;
}

.red-dot {
  background-color: #c93232;
}

.green-dot {
  background-color: #008000;
}
</style>
