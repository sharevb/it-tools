<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parse as parseYaml } from 'yaml';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

function transformer(value: string) {
  return withDefaultOnError(() => {
    const obj = parseYaml(value, { merge: true });
    return obj ? JSON.stringify(obj, null, 3) : '';
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => isNotThrowing(() => parseYaml(value)),
    message: t('tools.yaml-to-json-converter.texts.message-provided-yaml-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.yaml-to-json-converter.texts.input-label-your-yaml')"
    :input-placeholder="t('tools.yaml-to-json-converter.texts.input-placeholder-paste-your-yaml-here')"
    :output-label="t('tools.yaml-to-json-converter.texts.output-label-json-from-your-yaml')"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.json"
  />
</template>
