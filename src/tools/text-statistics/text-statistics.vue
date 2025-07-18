<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { formatMsDuration } from '../eta-calculator/eta-calculator.service';
import { getStringSizeInBytes, textStatistics } from './text-statistics.service';
import { formatBytes } from '@/utils/convert';

const { t } = useI18n();

const text = ref('');
const stats = computed(() => textStatistics(text.value));
</script>

<template>
  <c-card>
    <c-input-text v-model:value="text" multiline :placeholder="t('tools.text-statistics.texts.placeholder-your-text')" rows="5" />

    <n-space mt-3>
      <n-statistic :label="t('tools.text-statistics.texts.label-character-count')" :value="stats.chars" />
      <n-statistic :label="t('tools.text-statistics.texts.label-word-count')" :value="stats.words" />
      <n-statistic :label="t('tools.text-statistics.texts.label-sentences-count')" :value="stats.sentences" />
      <n-statistic :label="t('tools.text-statistics.texts.label-line-count')" :value="stats.lines" />
      <n-statistic :label="t('tools.text-statistics.texts.label-byte-size')" :value="formatBytes(getStringSizeInBytes(text))" />
    </n-space>

    <n-divider />

    <n-space mt-3>
      <n-statistic :label="t('tools.text-statistics.texts.label-unique-word-count')" :value="stats.words_uniques" />
      <n-statistic :label="t('tools.text-statistics.texts.label-unique-word-count-case-insensitive')" :value="stats.words_uniques_ci" />
      <n-statistic :label="t('tools.text-statistics.texts.label-read-time')" :value="formatMsDuration(stats.read_time * 1000)" />
    </n-space>

    <n-divider />

    <n-space>
      <n-statistic :label="t('tools.text-statistics.texts.label-chars-no-spaces')" :value="stats.chars_no_spaces" />
      <n-statistic :label="t('tools.text-statistics.texts.label-uppercase-chars')" :value="stats.chars_upper" />
      <n-statistic :label="t('tools.text-statistics.texts.label-lowercase-chars')" :value="stats.chars_lower" />
      <n-statistic :label="t('tools.text-statistics.texts.label-digit-chars')" :value="stats.chars_digits" />
      <n-statistic :label="t('tools.text-statistics.texts.label-punctuations')" :value="stats.chars_puncts" />
      <n-statistic :label="t('tools.text-statistics.texts.label-spaces-chars')" :value="stats.chars_spaces" />
      <n-statistic :label="t('tools.text-statistics.texts.label-word-count-no-punct')" :value="stats.words_no_puncs" />
    </n-space>
  </c-card>
</template>
