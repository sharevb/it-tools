<script setup lang="ts">
import { parse as parseYaml } from 'yaml';
import { nestifyObject } from 'nestify-anything';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const nestify = ref(false);

function transformer(value: string) {
  return withDefaultOnError(() => {
    let obj = parseYaml(value, { merge: true });
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
    message: 'Provided YAML is not valid.',
  },
];
</script>

<template>
  <n-space justify="center">
    <n-form-item label="Nestify ('a.b.c' to nested objects)" label-placement="left">
      <n-checkbox v-model:checked="nestify" />
    </n-form-item>
  </n-space>

  <format-transformer
    input-label="Your YAML"
    input-placeholder="Paste your yaml here..."
    output-label="JSON from your YAML"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.json"
  />
</template>
