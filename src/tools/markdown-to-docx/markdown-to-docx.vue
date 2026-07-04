<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import markdownDocx, { Packer } from 'markdown-docx';

const { t } = useI18n();

const inputMarkdown = ref('');
const dataUrl = ref('');
const error = ref('');

async function convertMarkdownToDocx() {
  if (!inputMarkdown.value.trim()) {
    return;
  }

  error.value = '';

  try {
    const doc = await markdownDocx(inputMarkdown.value);
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    dataUrl.value = url;

    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.docx';
    a.click();
    URL.revokeObjectURL(url);
  }
  catch (e: any) {
    error.value = e.toString();
  }
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputMarkdown"
      :label="t('tools.markdown-to-docx.texts.label-your-markdown-to-convert')"
      multiline
      :placeholder="t('tools.markdown-to-docx.texts.placeholder-put-your-markdown-content-here')"
      rows="10"
      mb-2
    />
    <n-space justify="center" mb-2>
      <c-button @click="convertMarkdownToDocx">
        {{ t('tools.markdown-to-docx.texts.tag-convert-to-docx-word') }}
      </c-button>
    </n-space>
    <c-alert v-if="error">
      {{ error }}
    </c-alert>
  </div>
</template>
