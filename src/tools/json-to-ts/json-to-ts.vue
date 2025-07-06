<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON2TS from 'json-to-ts';
import JSON5 from 'json5';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();

function convertJsonToTs(value: string) {
  return JSON2TS(JSON5.parse(value), { rootName: 'DataProps' }).join('\n\n').trim();
}

function transformer(value: string) {
  return value.trim() === '' ? '' : withDefaultOnError(() => convertJsonToTs(value), '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-ts.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-ts.texts.input-label-your-json')"
    :input-placeholder="t('tools.json-to-ts.texts.input-placeholder-paste-your-json-here')"
    :output-label="t('tools.json-to-ts.texts.output-label-ts-from-your-json')"
    output-language="ts"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
