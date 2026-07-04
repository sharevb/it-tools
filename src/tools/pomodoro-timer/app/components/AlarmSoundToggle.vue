<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  id: String,
  label: String,
});

const store = useStore('pomodoro-store');

// bind v-model="bool" to the vuex store
const bool = computed({
  get() {
    return store.state[props.id];
  },
  set() {
    store.commit('toggleAlarmSound');
  },
});
</script>

<template>
  <label :for="id" class="settings-label">{{ label }}
    <FontAwesomeIcon icon="fa-solid fa-volume-high" />
  </label>
  <input :id="id" v-model="bool" class="toggle toggle-spacing" type="checkbox">
</template>

<style scoped>
.toggle-spacing {
    margin: 0rem 0rem -0.4375rem 0rem;
}
.toggle {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 3.875rem;
  height: 2rem;
  display: inline-block;
  position: relative;
  border-radius: 3.125rem;
  overflow: hidden;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: #707070;
  transition: background-color ease 0.3s;
}
.toggle:before {
  content: "on off";
  display: block;
  position: absolute;
  z-index: 2;
  width: 1.75rem;
  height: 1.75rem;
  background: #fff;
  left: 0.125rem;
  top: 0.125rem;
  border-radius: 50%;
  font: 0.625rem/1.75rem Helvetica;
  text-transform: uppercase;
  font-weight: bold;
  text-indent: -1.375rem;
  word-spacing: 2.3125rem;
  color: #fff;
  text-shadow: -0.0625rem -0.0625rem rgba(0,0,0,0.15);
  white-space: nowrap;
  box-shadow: 0 0.0625rem 0.125rem rgba(0,0,0,0.2);
  transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
}
.toggle:checked {
  background-color: var(--pomodoro-app-accent-color);
}
.toggle:checked:before {
  left: 2rem;
}
</style>
