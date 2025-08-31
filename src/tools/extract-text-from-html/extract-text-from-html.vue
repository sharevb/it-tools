<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getTextFromHtml, validateHtml } from './extract-text-from-html.service';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();

function transformer(value: string) {
  if (value === '') {
    return '';
  }
  try {
    return getTextFromHtml(value);
  }
  catch (e: any) {
    return e.toString();
  }
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => value === '' || validateHtml(value),
    message: t('tools.extract-text-from-html.texts.message-provided-html-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-:label="t('tools.extract-text-from-html.texts.label-t-tools-extract-text-from-html-texts-input-label-your-raw-html')"
    :input-:placeholder="t('tools.extract-text-from-html.texts.placeholder-t-tools-extract-text-from-html-texts-input-placeholder-paste-your-raw-html-here')"
    :output-:label="t('tools.extract-text-from-html.texts.label-t-tools-extract-text-from-html-texts-output-label-text-from-your-html')"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
