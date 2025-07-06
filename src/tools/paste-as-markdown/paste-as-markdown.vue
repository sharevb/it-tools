<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { subscribe } from '@github/paste-markdown';
import CInputText from '@/ui/c-input-text/c-input-text.vue';

const { t } = useI18n();

const inputElement = ref<typeof CInputText>();
const markdown = ref('');

// Subscribe the behavior to the textarea.
onMounted(() => {
  subscribe(inputElement.value?.textareaRef as never);
});
</script>

<template>
  <c-card :title="t('tools.paste-as-markdown.texts.title-paste-in-markdown')" class="paste-zone">
    <n-ul>
      <n-li>{{ t('tools.paste-as-markdown.texts.tag-paste-spreadsheet-cells-and-html-tables-as-a-markdown-tables') }}</n-li>
      <n-li>{{ t('tools.paste-as-markdown.texts.tag-paste-urls-on-selected-text-as-markdown-links') }}</n-li>
      <n-li>{{ t('tools.paste-as-markdown.texts.tag-paste-text-containing-links-as-text-containing-markdown-links') }}</n-li>
      <n-li>{{ t('tools.paste-as-markdown.texts.tag-paste-image-urls-as-markdown-image-links') }}</n-li>
    </n-ul>
    <CInputText
      ref="inputElement"
      v-model:value="markdown"
      multiline
      :placeholder="t('tools.paste-as-markdown.texts.placeholder-paste-your-content-here')"
      rows="10"
      w-full
    />
  </c-card>
</template>
