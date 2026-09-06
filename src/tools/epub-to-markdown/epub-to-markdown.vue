<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { extractTextAndMetaFromEPUB } from './epub-to-markdown.service';

const { t } = useI18n();

const loading = ref(false);
const output = ref('');
const format = ref<'markdown' | 'text'>('markdown');
const metadata = ref<Record<string, any> | null>(null);

const formatOptions = [
  { label: t('tools.epub-to-markdown.texts.label-markdown'), value: 'markdown' },
  { label: t('tools.epub-to-markdown.texts.label-plain-text'), value: 'text' },
];

async function onUpload(file: File) {
  if (!file) {
    return;
  }

  loading.value = true;
  output.value = '';
  metadata.value = null;

  try {
    const parsed = await extractTextAndMetaFromEPUB(file, format.value);

    metadata.value = parsed.metadata;

    output.value = parsed.content;
  } catch (err: any) {
    output.value = err.toString();
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <n-space justify="center" mb-1>
      <c-select
        v-model:value="format"
        :label="t('tools.epub-to-markdown.texts.label-format')"
        label-position="left"
        :options="formatOptions"
        style="width: 180px"
      />
    </n-space>

    <c-file-upload
      :title="t('tools.epub-to-markdown.texts.title-drop-an-epub-file-here-or-click-to-select-a-file')"
      accept=".epub"
      mb-2
      :disabled="loading"
      @file-upload="onUpload"
    />

    <!-- Metadata -->
    <n-card v-if="metadata" :title="t('tools.epub-to-markdown.texts.title-metadata')" mb-1>
      <input-copyable
        :label="t('tools.epub-to-markdown.texts.label-title')"
        label-position="left"
        label-width="100px"
        mb-1
        :value="metadata.title"
      />
      <input-copyable
        :label="t('tools.epub-to-markdown.texts.label-creator')"
        label-position="left"
        label-width="100px"
        mb-1
        :value="metadata.creator"
      />
      <input-copyable
        :label="t('tools.epub-to-markdown.texts.label-language')"
        label-position="left"
        label-width="100px"
        mb-1
        :value="metadata.language"
      />
      <input-copyable
        :label="t('tools.epub-to-markdown.texts.label-publisher')"
        label-position="left"
        label-width="100px"
        mb-1
        :value="metadata.publisher"
      />
      <input-copyable
        :label="t('tools.epub-to-markdown.texts.label-identifier')"
        label-position="left"
        label-width="100px"
        mb-1
        :value="metadata.identifier"
      />
      <input-copyable
        :label="t('tools.epub-to-markdown.texts.label-rights')"
        label-position="left"
        label-width="100px"
        mb-1
        :value="metadata.rights"
      />
      <input-copyable
        :label="t('tools.epub-to-markdown.texts.label-description')"
        label-position="left"
        label-width="100px"
        mb-1
        :value="metadata.description"
      />
    </n-card>

    <n-space justify="center">
      <NSpin v-if="loading" />
    </n-space>

    <n-card v-if="output" :title="t('tools.epub-to-markdown.texts.title-epub-content')">
      <textarea-copyable :value="output" :language="format" download-file-name="book.md" />
    </n-card>
  </div>
</template>
