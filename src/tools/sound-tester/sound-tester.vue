<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

import { useAudioTester } from './useAudioTester';

const { playTone, playSweep, playWhiteNoise, playPinkNoise, stop } = useAudioTester();

const frequency = ref(440);

const bassTests = [20, 40, 60];

const trebleTests = [8000, 12000, 16000];
</script>

<template>
  <div>
    <n-card :title="t('tools.sound-tester.texts.title-general')" mb-2>
      <n-button @click="playTone(440)" mr-1>{{ t('tools.sound-tester.texts.tag-440hz-la') }}</n-button>
      <n-button @click="playSweep" mr-1>{{ t('tools.sound-tester.texts.tag-sweep') }}</n-button>
      <n-button @click="playWhiteNoise" mr-1>{{ t('tools.sound-tester.texts.tag-white-noise') }}</n-button>
      <n-button @click="playPinkNoise" mr-1>{{ t('tools.sound-tester.texts.tag-pink-noise') }}</n-button>

      <n-button type="error" @click="stop" ml-2>{{ t('tools.sound-tester.texts.tag-stop') }}</n-button>
    </n-card>

    <n-card :title="t('tools.sound-tester.texts.title-channel-tests')" mb-2>
      <n-button @click="playTone(440, -1)" mr-1>{{ t('tools.sound-tester.texts.tag-left') }}</n-button>
      <n-button @click="playTone(440, 1)" mr-1>{{ t('tools.sound-tester.texts.tag-right') }}</n-button>

      <n-button type="error" @click="stop" ml-2>{{ t('tools.sound-tester.texts.tag-stop') }}</n-button>
    </n-card>

    <n-card :title="t('tools.sound-tester.texts.title-bass-tests')" mb-2>
      <n-button v-for="freq in bassTests" :key="freq" @click="playTone(freq)" mr-1> {{ freq }}Hz </n-button>

      <n-button type="error" @click="stop" ml-2>{{ t('tools.sound-tester.texts.tag-stop') }}</n-button>
    </n-card>

    <n-card :title="t('tools.sound-tester.texts.title-treble-tests')" mb-2>
      <n-button v-for="freq in trebleTests" :key="freq" @click="playTone(freq)" mr-1> {{ freq / 1000 }}kHz </n-button>

      <n-button type="error" @click="stop" ml-2>{{ t('tools.sound-tester.texts.tag-stop') }}</n-button>
    </n-card>

    <n-card :title="t('tools.sound-tester.texts.title-custom-frequency')" mb-2>
      <n-form-item :label="t('tools.sound-tester.texts.label-frequency-hz')" label-placement="left">
        <n-slider v-model:value="frequency" :min="20" :max="20000" :step="1" mr-1 />
        <n-input-number v-model:value="frequency" :min="20" :max="20000" />
      </n-form-item>
      <n-space justify="center">
        <n-button type="primary" @click="playTone(frequency)">{{
          t('tools.sound-tester.texts.tag-play-this-frequency')
        }}</n-button>
        <n-button type="error" @click="stop" ml-2>{{ t('tools.sound-tester.texts.tag-stop') }}</n-button>
      </n-space>
    </n-card>
  </div>
</template>
