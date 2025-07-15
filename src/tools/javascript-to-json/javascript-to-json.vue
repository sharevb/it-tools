<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

function parseJSON(value: string) {
  try {
    return JSON5.parse(value);
  }
  catch {
    return JSON5.parse(value.replace(/`((?:[^`]|\\`)*)`/g, (_m, s) => `"${s.replace(/"/g, '\\""').replace(/\r/g, '\\r').replace(/\n/g, '\\n')}"`));
  }
}

const indentSize = useStorage('json-prettify:indent-size', 3);
const transformer = (value: string) => withDefaultOnError(() => JSON.stringify(parseJSON(value), null, indentSize.value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (value: string) => value === '' || isNotThrowing(() => JSON.stringify(parseJSON(value))),
    message: t('tools.javascript-to-json.texts.message-provided-js-object-is-not-valid'),
  },
];
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto;" flex justify-center gap-3>
      <n-form-item :label="t('tools.javascript-to-json.texts.label-indent-size')" label-placement="left" label-width="100" :show-feedback="false">
        <n-input-number v-model:value="indentSize" min="0" max="10" style="width: 100px" />
      </n-form-item>
    </div>
  </div>

  <format-transformer
    :input-label="t('tools.javascript-to-json.texts.input-label-your-javascript-object')"
    :input-placeholder="t('tools.javascript-to-json.texts.input-placeholder-paste-your-js-object-here')"
    :output-label="t('tools.javascript-to-json.texts.output-label-json-from-your-javascript-object')"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
