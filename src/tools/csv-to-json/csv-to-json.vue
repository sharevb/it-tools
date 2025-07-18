<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { convertCsvToArray } from './csv-to-json.service';
import FormatTransformer from '@/components/FormatTransformer.vue';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const typedValues = ref(false);

function transformer(value: string) {
  return withDefaultOnError(() => {
    if (value === '') {
      return '';
    }
    return JSON.stringify(convertCsvToArray(value, typedValues.value), null, 2);
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || ((v.includes(',') || v.includes(';') || v.includes('\t') || v.includes('|')) && v.includes('\n')),
    message: t('tools.csv-to-json.texts.message-provided-csv-is-not-valid'),
  },
];
</script>

<template>
  <n-form-item :label="t('tools.csv-to-json.texts.label-typed-values')" label-placement="left">
    <n-checkbox v-model:checked="typedValues" />
  </n-form-item>
  <FormatTransformer
    :input-label="t('tools.csv-to-json.texts.input-label-your-raw-csv')"
    :input-placeholder="t('tools.csv-to-json.texts.input-placeholder-paste-your-raw-csv-here')"
    :output-label="t('tools.csv-to-json.texts.output-label-json-version-of-your-csv')"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
