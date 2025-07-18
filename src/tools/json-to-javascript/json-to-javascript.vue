<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const indentSize = useStorage('json-prettify:indent-size', 3);
const transformer = (value: string) => withDefaultOnError(() => JSON5.stringify(JSON.parse(value), null, indentSize.value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => JSON5.stringify(JSON.parse(value))),
    message: t('tools.json-to-javascript.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px" flex justify-center gap-3>
      <n-form-item :label="t('tools.json-to-javascript.texts.label-indent-size')" label-placement="left" label-width="100" :show-feedback="false">
        <n-input-number v-model:value="indentSize" min="0" max="10" style="width: 100px" />
      </n-form-item>
    </div>
  </div>

  <format-transformer
    :input-label="t('tools.json-to-javascript.texts.input-label-your-json')"
    :input-placeholder="t('tools.json-to-javascript.texts.input-placeholder-paste-your-json-here')"
    :output-label="t('tools.json-to-javascript.texts.output-label-javascript-object-from-your-json')"
    output-language="javascript"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
