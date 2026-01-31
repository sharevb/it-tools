<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { merge } from 'merge-anything';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();

const json1 = ref('{a:{b:5}}');
const json2 = ref('{a:{c:6}}');
const merged = computed(() => {
  try {
    return JSON.stringify(
      merge(
        JSON.parseBigNum(json1.value),
        JSON.parseBigNum(json2.value),
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
    message: t('tools.json-merger.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <c-card :title="t('tools.json-merger.texts.title-your-first-json-content')">
    <c-input-text v-model:value="json1" multiline mb-1 rows="10" :placeholder="t('tools.json-merger.texts.placeholder-put-your-json-content')" :validation-rules="rules" />
  </c-card>
  <c-card :title="t('tools.json-merger.texts.title-your-second-json-content')">
    <c-input-text v-model:value="json2" multiline mb-1 rows="10" :placeholder="t('tools.json-merger.texts.placeholder-put-your-json-content')" :validation-rules="rules" />
  </c-card>
  <c-card :title="t('tools.json-merger.texts.title-merged-json')">
    <textarea-copyable v-model:value="merged" language="json" :placeholder="t('tools.json-merger.texts.placeholder-your-merged-json-will-be-here')" download-file-name="merge.json" />
  </c-card>
</template>
