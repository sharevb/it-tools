<script setup lang="ts">
import JSON5 from 'json5';
import { nestifyObject } from 'nestify-anything';
import { flatten } from 'flatten-anything';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const mode = ref<'flatten' | 'nestify'>('flatten');
const defaultValue = '{a: {b: 2}}';
function transformer(value: string) {
  return withDefaultOnError(
    () => {
      let o = JSON.parseBigInt(value);
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
    message: 'Provided JSON is not valid',
  },
];
</script>

<template>
  <NSpace justify="center">
    <n-form-item label="Mode" label-placement="left">
      <n-radio-group v-model:value="mode">
        <n-radio value="flatten">
          Flatten
        </n-radio>
        <n-radio value="nestify">
          Unflatten/Nestify
        </n-radio>
      </n-radio-group>
    </n-form-item>
  </NSpace>

  <format-transformer
    input-label="Your JSON content:"
    :input-default="defaultValue"
    input-placeholder="Paste your JSON content here"
    output-label="Transformed JSON:"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.json"
  />
</template>
