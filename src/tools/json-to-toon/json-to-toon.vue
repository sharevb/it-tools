<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { encode } from '@toon-format/toon';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const defaultValue = `{
  users: [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' }
  ]
}`;

function transformer(value: string) {
  return withDefaultOnError(() => {
    if (value === '') {
      return '';
    }
    return encode(JSON.parseBigNum(value));
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-toon.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-toon.texts.input-label-your-raw-json')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.json-to-toon.texts.input-placeholder-paste-your-raw-json-here')"
    :output-label="t('tools.json-to-toon.texts.output-label-toon-version-of-your-json')"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.toon"
  />
</template>
