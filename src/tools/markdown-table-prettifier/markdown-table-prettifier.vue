<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { CliPrettify } from 'markdown-table-prettify';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const inputMarkdown = ref('');
const outputMarkdown = computed(() => {
  return CliPrettify.prettify(inputMarkdown.value);
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputMarkdown"
      multiline raw-text
      :placeholder="t('tools.markdown-table-prettifier.texts.placeholder-your-markdown-table-to-prettify')"
      rows="8"
      autofocus
      :label="t('tools.markdown-table-prettifier.texts.label-markdown-table-to-prettify')"
    />

    <n-divider />

    <n-form-item :label="t('tools.markdown-table-prettifier.texts.label-prettified-markdown')">
      <TextareaCopyable :value="outputMarkdown" :word-wrap="true" language="markdown" download-file-name="output.md" />
    </n-form-item>
  </div>
</template>
