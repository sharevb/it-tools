<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computeDuration } from './duration-calculator.service';

const { t } = useI18n();

const inputDurations = ref('');
const result = computed(() => computeDuration(inputDurations.value));
const errors = computed(() => result.value.errors.join('\n'));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputDurations"
      multiline
      rows="5"
      :label="t('tools.duration-calculator.texts.label-duration-s')"
      :placeholder="t('tools.duration-calculator.texts.placeholder-please-enter-duration-one-per-line-with-optional-sign')"
      mb-2
    />
    <n-p>{{ t('tools.duration-calculator.texts.tag-supports-comment-line-hh-mm-ss-fff-3d-1h-3s-p4dt12h20m20-3s') }}</n-p>

    <n-divider />

    <c-card :title="t('tools.duration-calculator.texts.title-total')">
      <input-copyable :label="t('tools.duration-calculator.texts.label-prettified')" :value="result.total.prettified" />
      <input-copyable :label="t('tools.duration-calculator.texts.label-prettified-full')" :value="result.total.prettifiedVerbose" />
      <input-copyable :label="t('tools.duration-calculator.texts.label-prettified-colon')" :value="result.total.prettifiedColonNotation" />
      <input-copyable :label="t('tools.duration-calculator.texts.label-prettified-days')" :value="result.total.prettifiedDaysColon" />
      <input-copyable :label="t('tools.duration-calculator.texts.label-prettified-hours')" :value="result.total.prettifiedHoursColon" />
      <input-copyable :label="t('tools.duration-calculator.texts.label-prettified-iso8601')" :value="result.total.iso8601Duration" />
      <input-copyable :label="t('tools.duration-calculator.texts.label-milliseconds')" :value="result.total.milliseconds" />
      <input-copyable :label="t('tools.duration-calculator.texts.label-seconds')" :value="result.total.seconds" />
      <input-copyable :label="t('tools.duration-calculator.texts.label-minutes')" :value="result.total.minutes" />
      <input-copyable :label="t('tools.duration-calculator.texts.label-hours')" :value="result.total.hours" />
      <input-copyable :label="t('tools.duration-calculator.texts.label-days')" :value="result.total.days" />
      <input-copyable :label="t('tools.duration-calculator.texts.label-weeks')" :value="result.total.weeks" />
      <input-copyable :label="t('tools.duration-calculator.texts.label-years')" :value="result.total.years" />
    </c-card>

    <c-card :title="t('tools.duration-calculator.texts.title-lines-errors')" mb-2>
      <textarea-copyable :value="errors" />
    </c-card>
  </div>
</template>
