<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import YAML from 'yaml';
import { merge } from 'merge-anything';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();

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
    message: t('tools.yaml-merger.texts.message-provided-yaml-is-not-valid'),
  },
];
</script>

<template>
  <c-card :title="t('tools.yaml-merger.texts.title-your-first-yaml-content')">
    <c-input-text v-model:value="yaml1" multiline mb-1 rows="10" :placeholder="t('tools.yaml-merger.texts.placeholder-put-your-yaml-content')" :validation-rules="rules" />
  </c-card>
  <c-card :title="t('tools.yaml-merger.texts.title-your-second-yaml-content')">
    <c-input-text v-model:value="yaml2" multiline mb-1 rows="10" :placeholder="t('tools.yaml-merger.texts.placeholder-put-your-yaml-content')" :validation-rules="rules" />
  </c-card>
  <c-card :title="t('tools.yaml-merger.texts.title-merged-yaml')">
    <textarea-copyable v-model:value="merged" language="yaml" :placeholder="t('tools.yaml-merger.texts.placeholder-your-merged-yaml-will-be-here')" download-file-name="merge.yaml" />
  </c-card>
</template>
