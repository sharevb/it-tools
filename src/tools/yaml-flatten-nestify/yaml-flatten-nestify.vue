<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import YAML from 'yaml';
import { nestifyObject } from 'nestify-anything';
import { flatten } from 'flatten-anything';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const mode = ref<'flatten' | 'nestify'>('flatten');
const defaultValue = `a:
  b: 5`;
function transformer(value: string) {
  return withDefaultOnError(
    () => {
      let o = YAML.parse(value, { intAsBigInt: true });
      if (mode.value === 'flatten') {
        o = flatten(o);
      }
      else {
        o = nestifyObject(o);
      }
      return YAML.stringify(o);
    },
    '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || YAML.parse(v),
    message: t('tools.yaml-flatten-nestify.texts.message-provided-yaml-is-not-valid'),
  },
];
</script>

<template>
  <NSpace justify="center">
    <n-form-item :label="t('tools.yaml-flatten-nestify.texts.label-mode')" label-placement="left">
      <n-radio-group v-model:value="mode">
        <n-radio value="flatten">
          {{ t('tools.yaml-flatten-nestify.texts.tag-flatten') }}
        </n-radio>
        <n-radio value="nestify">
          {{ t('tools.yaml-flatten-nestify.texts.tag-unflatten-nestify') }}
        </n-radio>
      </n-radio-group>
    </n-form-item>
  </NSpace>

  <format-transformer
    :input-label="t('tools.yaml-flatten-nestify.texts.input-label-your-yaml-content')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.yaml-flatten-nestify.texts.input-placeholder-paste-your-yaml-content-here')"
    :output-label="t('tools.yaml-flatten-nestify.texts.output-label-transformed-yaml')"
    output-language="yaml"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.yaml"
  />
</template>
