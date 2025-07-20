<script setup lang="ts">
import YAML from 'yaml';
import { nestifyObject } from 'nestify-anything';
import { flatten } from 'flatten-anything';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

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
    message: 'Provided YAML is not valid',
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
    input-label="Your YAML content:"
    :input-default="defaultValue"
    input-placeholder="Paste your YAML content here"
    output-label="Transformed YAML:"
    output-language="yaml"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.yaml"
  />
</template>
