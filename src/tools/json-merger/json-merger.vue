<script setup lang="ts">
import JSON5 from 'json5';
import { merge } from 'merge-anything';
import type { UseValidationRule } from '@/composable/validation';

const json1 = ref('{a:{b:5}}');
const json2 = ref('{a:{c:6}}');
const merged = computed(() => {
  try {
    return JSON.stringify(
      merge(
        JSON.parseBigInt(json1.value),
        JSON.parseBigInt(json2.value),
      ),
      null, 2,
    );
  }
  catch (e: any) {
    return e.toString();
  }
});

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid',
  },
];
</script>

<template>
  <c-card title="Your first JSON Content:">
    <c-input-text v-model:value="json1" multiline mb-1 rows="10" placeholder="Put your JSON content" :validation-rules="rules" />
  </c-card>
  <c-card title="Your second JSON Content:">
    <c-input-text v-model:value="json2" multiline mb-1 rows="10" placeholder="Put your JSON content" :validation-rules="rules" />
  </c-card>
  <c-card title="Merged JSON:">
    <textarea-copyable v-model:value="merged" language="json" placeholder="Your merged JSON will be here" download-file-name="merge.json" />
  </c-card>
</template>
