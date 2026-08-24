<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { convertMarkdown, strategies } from './markdown-format-converter.service';

const { t } = useI18n();

const sourceFormat = useQueryParamOrStorage<string>({
  name: 'sourceFormat',
  storageName: 'md-conv:source',
  defaultValue: 'github',
});

const targetFormat = useQueryParamOrStorage<string>({
  name: 'targetFormat',
  storageName: 'md-conv:target',
  defaultValue: 'slack',
});

const inputMarkdown = ref('');

const formatOptions = strategies.map((s) => ({
  value: s.id,
  label: s.name,
}));

const outputConverted = computed(() => {
  return convertMarkdown(inputMarkdown.value, sourceFormat.value, targetFormat.value);
});
</script>

<template>
  <div>
    <n-form-item :label="t('tools.markdown-format-converter.texts.label-input-markdown')">
      <n-tabs type="segment" animated>
        <n-tab-pane name="text" :tab="t('tools.markdown-format-converter.texts.label-text')">
          <c-input-text
            v-model:value="inputMarkdown"
            multiline
            raw-text
            :placeholder="t('tools.markdown-format-converter.texts.placeholder-input-markdown')"
            rows="10"
            autofocus
          />
        </n-tab-pane>
        <n-tab-pane name="preview" :tab="t('tools.markdown-format-converter.texts.label-preview')">
          <div class="markdown-preview-pane">
            <c-markdown v-if="inputMarkdown" :markdown="inputMarkdown" />
            <n-text v-else depth="3">Nothing to preview</n-text>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-form-item>

    <n-divider />

    <n-space justify="start" mb-4>
      <c-select
        v-model:value="sourceFormat"
        :label="t('tools.markdown-format-converter.texts.label-source-format')"
        label-position="left"
        style="width: 320px"
        :options="formatOptions"
      />
      <c-select
        v-model:value="targetFormat"
        :label="t('tools.markdown-format-converter.texts.label-target-format')"
        label-position="left"
        style="width: 320px"
        :options="formatOptions"
      />
    </n-space>

    <n-form-item :label="t('tools.markdown-format-converter.texts.label-converted-output')">
      <n-tabs type="segment" animated>
        <n-tab-pane name="text" :tab="t('tools.markdown-format-converter.texts.label-text')">
          <TextareaCopyable :value="outputConverted" download-file-name="converted.md" />
        </n-tab-pane>
        <n-tab-pane name="preview" :tab="t('tools.markdown-format-converter.texts.label-preview')">
          <div class="markdown-preview-pane">
            <c-markdown v-if="outputConverted" :markdown="outputConverted" />
            <n-text v-else depth="3">Nothing to preview</n-text>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-form-item>
  </div>
</template>

<style lang="less" scoped>
.markdown-preview-pane {
  min-height: 240px;
  max-height: 450px;
  padding: 18px;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  overflow: auto;
  background: var(--n-color);
  width: 100%;
}

:deep(.markdown-preview-pane) {
  line-height: 1.65;
}

:deep(.markdown-preview-pane > div > *:first-child) {
  margin-top: 0;
}

:deep(.markdown-preview-pane > div > *:last-child) {
  margin-bottom: 0;
}

:deep(.markdown-preview-pane table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

:deep(.markdown-preview-pane th),
:deep(.markdown-preview-pane td) {
  padding: 10px 12px;
  border: 1px solid var(--n-border-color);
  text-align: left;
}

:deep(.markdown-preview-pane th) {
  font-weight: 600;
  background: var(--n-color-modal);
}

:deep(.markdown-preview-pane code) {
  padding: 2px 5px;
  border-radius: 4px;
  background: var(--n-color-modal);
}

:deep(.markdown-preview-pane pre) {
  padding: 14px;
  border-radius: 6px;
  overflow: auto;
  background: #0f172a;
}

:deep(.markdown-preview-pane pre code) {
  padding: 0;
  color: #e2e8f0;
  background: transparent;
}
</style>
