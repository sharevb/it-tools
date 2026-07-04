<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { decode } from '@toon-format/toon';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const defaultValue = `users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user`;

function transformer(value: string) {
  return withDefaultOnError(() => {
    if (value === '') {
      return '';
    }
    return JSON.stringify(decode(value), null, 2);
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || decode(v),
    message: t('tools.toon-to-json.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.toon-to-json.texts.input-label-your-raw-toon')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.toon-to-json.texts.input-placeholder-paste-your-raw-toon-here')"
    :output-label="t('tools.toon-to-json.texts.output-label-json-version')"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.json"
  />
</template>
