<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { nestifyObject } from 'nestify-anything';
import { flatten } from 'flatten-anything';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const mode = ref<'flatten' | 'nestify'>('flatten');
const defaultValue = '{a: {b: 2}}';
function transformer(value: string) {
  return withDefaultOnError(
    () => {
      let o = JSON.parseBigNum(value);
      if (mode.value === 'flatten') {
        o = flatten(o);
      }
      else {
        o = nestifyObject(o);
      }
      return JSON.stringify(o, null, 2);
    },
    '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-flatten-nestify.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <NSpace justify="center">
    <n-form-item :label="t('tools.json-flatten-nestify.texts.label-mode')" label-placement="left">
      <n-radio-group v-model:value="mode">
        <n-radio value="flatten">
          {{ t('tools.json-flatten-nestify.texts.tag-flatten') }}
        </n-radio>
        <n-radio value="nestify">
          {{ t('tools.json-flatten-nestify.texts.tag-unflatten-nestify') }}
        </n-radio>
      </n-radio-group>
    </n-form-item>
  </NSpace>

  <format-transformer
    :input-label="t('tools.json-flatten-nestify.texts.input-label-your-json-content')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.json-flatten-nestify.texts.input-placeholder-paste-your-json-content-here')"
    :output-label="t('tools.json-flatten-nestify.texts.output-label-transformed-json')"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.json"
  />
</template>
