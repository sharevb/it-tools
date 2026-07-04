<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parse as parseYaml } from 'yaml';
import { nestifyObject } from 'nestify-anything';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const nestify = ref(false);

function transformer(value: string) {
  return withDefaultOnError(() => {
    let obj = parseYaml(value, { merge: true, intAsBigInt: true });
    if (nestify.value) {
      if (obj && Array.isArray(obj)) {
        obj = (obj as any[]).map(o => nestifyObject(o));
      }
      else {
        obj = nestifyObject(obj);
      }
    }
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
  <n-space justify="center">
    <n-form-item :label="t('tools.yaml-to-json-converter.texts.label-nestify-a-b-c-to-nested-objects')" label-placement="left">
      <n-checkbox v-model:checked="nestify" />
    </n-form-item>
  </n-space>

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
