<script setup>
import { useStore } from 'vuex';
import NumberInput from '../components/NumberInput.vue';
import AppColorPicker from '../components/AppColorPicker.vue';
import AlarmSoundToggle from '../components/AlarmSoundToggle.vue';

const store = useStore('pomodoro-store');

store.commit('setInitialTimer');
store.commit('setFirstVisitStatus', { propValue: false });
</script>

<template>
  <form>
    <NumberInput id="workInterval" :min="1" :max="120" :label="$t('tools.pomodoro-timer.Settings.text.work-interval')" /><span>{{ $t('tools.pomodoro-timer.Settings.text.min') }}</span><br>
    <NumberInput id="shortBreak" :min="1" :max="120" :label="$t('tools.pomodoro-timer.Settings.text.short-break')" /><span>{{ $t('tools.pomodoro-timer.Settings.text.min') }}</span><br>
    <NumberInput id="shortBreakCount" :min="1" :max="10" :label="$t('tools.pomodoro-timer.Settings.text.short-break-count')" /><span>{{ $t('tools.pomodoro-timer.Settings.text.breaks') }}</span><br>
    <NumberInput id="longBreak" :min="1" :max="120" :label="$t('tools.pomodoro-timer.Settings.text.long-break')" /><span>{{ $t('tools.pomodoro-timer.Settings.text.min') }}</span><br>
    <AlarmSoundToggle id="prefersAlarmSound" :label="$t('tools.pomodoro-timer.Settings.text.alarm-sound')" /><br>
    <AppColorPicker id="appAccentColor" :label="$t('tools.pomodoro-timer.Settings.text.app-color')" /><br>
    <a class="lets-go" @click="store.commit('goToPage', 'home')">
      {{ $t('tools.pomodoro-timer.Settings.text.lets-go') }}
    </a>
    <button type="button" class="reset-btn" @click="store.commit('restoreDefaultSettings')">
      {{ $t('tools.pomodoro-timer.Settings.text.restore-defaults') }}
    </button>
  </form>
</template>

<style scoped>
form {
    align-self: center;
    margin-top: -0.625rem;
    font-size: 1.25rem;
}
.lets-go {
    text-decoration: none;
    outline: none!important;
    border-style: none;
    border: white 0.0625rem solid;
    box-shadow: 1px 1px 7px -3px black;
    border-radius: 0.375rem;
    background-color: var(--pomodoro-app-accent-color);
    color: var(--pomodoro-text-contrast-color);
    padding: 10px 15px 9px 15px;
    cursor: pointer;
    margin: 0 auto;
    display: block;
    text-align: center;
    width: 90%;
    font-size: 1.125rem;
}
.reset-btn {
    display: block;
    margin: 0 auto;
    margin-top: 1.25rem;
    width: 90%;
    background-color: white;
    color: var(--pomodoro-app-accent-color);
    border: 0.0625rem solid var(--pomodoro-app-accent-color);
    box-shadow: none;
}
</style>
