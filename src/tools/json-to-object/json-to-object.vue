<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import stringifyObject from 'stringify-object';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

function transformer(value: string) {
  return withDefaultOnError(() => stringifyObject(JSON5.parse(value), {
    indent: '  ',
    singleQuotes: false,
  }), '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => stringifyObject(JSON5.parse(value))),
    message: t('tools.json-to-object.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-object.texts.input-label-your-json')"
    :input-placeholder="t('tools.json-to-object.texts.input-placeholder-paste-your-json-here')"
    :output-label="t('tools.json-to-object.texts.output-label-object-from-your-json')"
    output-language="js"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
