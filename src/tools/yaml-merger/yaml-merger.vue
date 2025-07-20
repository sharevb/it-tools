<script setup lang="ts">
import YAML from 'yaml';
import { merge } from 'merge-anything';
import type { UseValidationRule } from '@/composable/validation';

const yaml1 = ref(`a:
  b: 5`);
const yaml2 = ref(`a:
  c: 5`);
const merged = computed(() => {
  try {
    return YAML.stringify(
      merge(
        YAML.parse(yaml1.value, { intAsBigInt: true }),
        YAML.parse(yaml2.value, { intAsBigInt: true }),
      ),
    );
  }
  catch (e: any) {
    return e.toString();
  }
});

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || YAML.parse(v),
    message: 'Provided YAML is not valid',
  },
];
</script>

<template>
  <c-card title="Your first YAML Content:">
    <c-input-text v-model:value="yaml1" multiline mb-1 rows="10" placeholder="Put your YAML content" :validation-rules="rules" />
  </c-card>
  <c-card title="Your second YAML Content:">
    <c-input-text v-model:value="yaml2" multiline mb-1 rows="10" placeholder="Put your YAML content" :validation-rules="rules" />
  </c-card>
  <c-card title="Merged YAML:">
    <textarea-copyable v-model:value="merged" language="yaml" placeholder="Your merged YAML will be here" download-file-name="merge.yaml" />
  </c-card>
</template>
