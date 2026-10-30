<script setup lang="ts">
import { useAudioTester } from './useAudioTester';

const { playTone, playSweep, playWhiteNoise, playPinkNoise, stop } = useAudioTester();

const frequency = ref(440);

const bassTests = [20, 40, 60];

const trebleTests = [8000, 12000, 16000];
</script>

<template>
  <div>
    <n-card title="General" mb-2>
      <n-button @click="playTone(440)" mr-1> 440Hz / La </n-button>
      <n-button @click="playSweep" mr-1> Sweep </n-button>
      <n-button @click="playWhiteNoise" mr-1> White Noise </n-button>
      <n-button @click="playPinkNoise" mr-1> Pink Noise </n-button>

      <n-button type="error" @click="stop" ml-2> Stop </n-button>
    </n-card>

    <n-card title="Channel Tests" mb-2>
      <n-button @click="playTone(440, -1)" mr-1> Left </n-button>
      <n-button @click="playTone(440, 1)" mr-1> Right </n-button>

      <n-button type="error" @click="stop" ml-2> Stop </n-button>
    </n-card>

    <n-card title="Bass Tests" mb-2>
      <n-button v-for="freq in bassTests" :key="freq" @click="playTone(freq)" mr-1> {{ freq }}Hz </n-button>

      <n-button type="error" @click="stop" ml-2> Stop </n-button>
    </n-card>

    <n-card title="Treble Tests" mb-2>
      <n-button v-for="freq in trebleTests" :key="freq" @click="playTone(freq)" mr-1> {{ freq / 1000 }}kHz </n-button>

      <n-button type="error" @click="stop" ml-2> Stop </n-button>
    </n-card>

    <n-card title="Custom Frequency" mb-2>
      <n-form-item label="Frequency (Hz):" label-placement="left">
        <n-slider v-model:value="frequency" :min="20" :max="20000" :step="1" mr-1 />
        <n-input-number v-model:value="frequency" :min="20" :max="20000" />
      </n-form-item>
      <n-space justify="center">
        <n-button type="primary" @click="playTone(frequency)"> Play this frequency </n-button>
        <n-button type="error" @click="stop" ml-2> Stop </n-button>
      </n-space>
    </n-card>
  </div>
</template>
