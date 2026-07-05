<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { NAlert, NInput, NProgress, NTag } from 'naive-ui';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

const { t } = useI18n();

const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnEnPackage.translations,
};
zxcvbnOptions.setOptions(options);

const password = ref('');

// Compute password strength
const result = computed(() => zxcvbn(password.value));

// Map score to label and color
const strengthLabel = computed(() => {
  const score = result.value.score;
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['error', 'warning', 'info', 'success', 'success'] as const;
  return {
    label: labels[score],
    color: colors[score],
  };
});

// Progress bar and feedback
const strength = computed(() => {
  const score = result.value.score;
  const percent = (score / 4) * 100;
  const colorMap = ['#d32f2f', '#f57c00', '#fbc02d', '#388e3c', '#2e7d32'];
  return {
    percent,
    color: colorMap[score],
  };
});

// Nuanced feedback
const warning = computed(() => result.value.feedback.warning);
const suggestions = computed(() => result.value.feedback.suggestions);
</script>

<template>
  <div>
    <NInput
      v-model:value="password"
      type="password"
      :placeholder="t('tools.zxcvbn-password-strength.texts.placeholder-enter-your-password')"
      show-password-on="click"
      clearable
    />

    <div v-if="password" mt-1>
      <NProgress type="line" :percentage="strength.percent" :color="strength.color" show-indicator />

      <n-space justify="center" mt-2>
        <NTag :type="strengthLabel.color" size="small">
          {{ strengthLabel.label }}
        </NTag>
      </n-space>
      <div mt-1>
        <span>{{ t('tools.zxcvbn-password-strength.texts.tag-estimated-fast-offline-crack-time-1e10-s') }}</span>
        {{ result.crackTimesDisplay.offlineFastHashing1e10PerSecond }}
      </div>
      <div mt-1>
        <span>{{ t('tools.zxcvbn-password-strength.texts.tag-estimated-slow-offline-crack-time-1e4-s') }}</span>
        {{ result.crackTimesDisplay.offlineSlowHashing1e4PerSecond }}
      </div>
      <div mt-1>
        <span>{{ t('tools.zxcvbn-password-strength.texts.tag-estimated-online-throttling-crack-time-10-s') }}</span>
        {{ result.crackTimesDisplay.onlineNoThrottling10PerSecond }}
      </div>
      <div mt-1>
        <span>{{ t('tools.zxcvbn-password-strength.texts.tag-estimated-online-no-throttling-crack-time-10-s') }}</span>
        {{ result.crackTimesDisplay.onlineNoThrottling10PerSecond }}
      </div>

      <div mt-2>
        <NAlert v-if="warning" type="warning" :title="t('tools.zxcvbn-password-strength.texts.title-warning')">
          {{ warning }}
        </NAlert>
        <NAlert
          v-if="suggestions.length"
          type="info"
          :title="t('tools.zxcvbn-password-strength.texts.title-suggestions')"
          mt-2
        >
          <ul>
            <li v-for="(s, i) in suggestions" :key="i">
              {{ s }}
            </li>
          </ul>
        </NAlert>
      </div>
    </div>
  </div>
</template>
