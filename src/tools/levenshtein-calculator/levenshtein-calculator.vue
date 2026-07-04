<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import levenshtein from 'damerau-levenshtein';

const { t } = useI18n();

const stringA = ref('');
const stringB = ref('');
const result = computed(() => levenshtein(stringA.value, stringB.value));
</script>

<template>
  <c-input-text v-model:value="stringA" :label="t('tools.levenshtein-calculator.texts.label-first-string')" label-position="left" :placeholder="t('tools.levenshtein-calculator.texts.placeholder-enter-first-string')" mb-1 />
  <c-input-text v-model:value="stringB" :label="t('tools.levenshtein-calculator.texts.label-second-string')" label-position="left" :placeholder="t('tools.levenshtein-calculator.texts.placeholder-enter-second-string')" mb-1 />

  <n-divider />

  <c-card v-if="result" :title="t('tools.levenshtein-calculator.texts.title-results')">
    <input-copyable :label="t('tools.levenshtein-calculator.texts.label-distance')" label-position="left" :value="result.steps" mb-1 />
    <input-copyable :label="t('tools.levenshtein-calculator.texts.label-relative-distance')" label-position="left" :value="result.relative" mb-1 />
    <input-copyable :label="t('tools.levenshtein-calculator.texts.label-similarity')" label-position="left" :value="result.similarity" mb-1 />
  </c-card>
</template>
