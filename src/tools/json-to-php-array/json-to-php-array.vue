<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import jsonar from 'jsonar-mod';
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const defaultValue = `{
  a:"b", 
  arr: [1, "2"], 
  nested: {
    c:12, 
    d: "az"
  }
}`;
function transformer(value: string) {
  return withDefaultOnError(() => jsonar.arrify(JSON5.parse(value), { prettify: true }), '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => JSON5.parse(v),
    message: t('tools.json-to-php-array.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-php-array.texts.input-label-your-json')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.json-to-php-array.texts.input-placeholder-paste-your-json-here')"
    :output-label="t('tools.json-to-php-array.texts.output-label-php-array-version')"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
