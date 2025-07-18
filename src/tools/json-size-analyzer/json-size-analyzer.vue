<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { getJsonUsageTreeNodes } from './json-size-analyzer.service';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const json = ref('{"a": 1, "b": [1,2,3]}');
const maxDepth = ref(100);
const target = ref('');

const jsonSizes = computed(() => {
  const jsonObj = JSON5.parse(json.value);
  if (!jsonObj) {
    return null;
  }
  return [getJsonUsageTreeNodes(jsonObj, maxDepth.value - 1, target.value)];
});
const searchInAnalysis = ref('');

const jsonValidation = useValidation({
  source: json,
  rules: [
    {
      validator: (v) => {
        return JSON5.parse(v);
      },
      message: t('tools.json-size-analyzer.texts.message-provided-json-is-not-valid'),
    },
  ],
});
</script>

<template>
  <div>
    <c-card :title="t('tools.json-size-analyzer.texts.title-input')" mb-2>
      <c-input-text
        v-model:value="json"
        :label="t('tools.json-size-analyzer.texts.label-json')"
        multiline
        :placeholder="t('tools.json-size-analyzer.texts.placeholder-put-your-json-data-here')"
        rows="5"
        :validation="jsonValidation"
        mb-2
      />

      <n-form-item :label="t('tools.json-size-analyzer.texts.label-max-depth')" label-placement="left">
        <n-input-number v-model:value="maxDepth" :min="0" w-full />
      </n-form-item>

      <c-input-text
        v-model:value="target"
        :label="t('tools.json-size-analyzer.texts.label-target-node')"
        :placeholder="t('tools.json-size-analyzer.texts.placeholder-where-to-start-the-analyze-ie-a-0-b-c')"
        mb-2
      />
    </c-card>

    <c-card v-if="jsonSizes" :title="t('tools.json-size-analyzer.texts.title-analysis')">
      <n-input v-model:value="searchInAnalysis" :placeholder="t('tools.json-size-analyzer.texts.placeholder-search-in-result')" />
      <n-tree
        :show-irrelevant-nodes="false"
        :pattern="searchInAnalysis"
        :default-expand-all="true"
        :data="jsonSizes"
        block-line
      />
    </c-card>
  </div>
</template>
