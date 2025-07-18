<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { stringify } from 'yaml';
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const transformer = (value: string) => withDefaultOnError(() => stringify(JSON.parseBigInt(value)), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => stringify(JSON5.parse(value))),
    message: t('tools.json-to-yaml-converter.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-yaml-converter.texts.input-label-your-json')"
    :input-placeholder="t('tools.json-to-yaml-converter.texts.input-placeholder-paste-your-json-here')"
    :output-label="t('tools.json-to-yaml-converter.texts.output-label-yaml-from-your-json')"
    output-language="yaml"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.yaml"
  />
</template>
