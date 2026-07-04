<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import removeMarkdown from 'remove-markdown';

const { t } = useI18n();

const markdown = ref('');
const plaintext = computed(() => {
  return removeMarkdown(markdown.value || '');
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="markdown"
      :label="t('tools.markdown-to-text.texts.label-input-mardown')"
      multiline
      :placeholder="t('tools.markdown-to-text.texts.placeholder-enter-your-markdown-here')"
      rows="6"
      mb-2
    />

    <c-card v-if="plaintext" :title="t('tools.markdown-to-text.texts.title-output-text')">
      <textarea-copyable :value="plaintext" />
    </c-card>
  </div>
</template>
