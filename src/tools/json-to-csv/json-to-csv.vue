<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { convertArrayToCsv } from './json-to-csv.service';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const defaultValue = '[\n   {\n      "Age": 18,\n      "Country": "Germany",\n      "Gender": "Male",\n      "Purchased": "N",\n      "Salary": 20000\n   },\n   {\n      "Age": 19,\n      "Country": "France",\n      "Gender": "Female",\n      "Purchased": "N",\n      "Salary": 22000\n   },\n   {\n      "Age": 20,\n      "Country": "England",\n      "Gender": "Female",\n      "Purchased": "N",\n      "Salary": 24000\n   }\n]';

function transformer(value: string) {
  return withDefaultOnError(() => {
    if (value === '') {
      return '';
    }
    return convertArrayToCsv({ arrayOrObject: JSON.parseBigInt(value) });
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-csv.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-csv.texts.input-label-your-raw-json')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.json-to-csv.texts.input-placeholder-paste-your-raw-json-here')"
    :output-label="t('tools.json-to-csv.texts.output-label-csv-version-of-your-json')"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.csv"
  />
</template>
