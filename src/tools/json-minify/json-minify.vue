<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const defaultValue = '{\n\t"hello": [\n\t\t"world"\n\t]\n}';
const transformer = (value: string) => withDefaultOnError(() => JSON.stringify(JSON5.parse(value), null, 0), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-minify.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-minify.texts.input-label-your-raw-json')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.json-minify.texts.input-placeholder-paste-your-raw-json-here')"
    :output-label="t('tools.json-minify.texts.output-label-minified-version-of-your-json')"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.json"
  />
</template>
