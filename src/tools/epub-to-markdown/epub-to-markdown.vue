<script setup lang="ts">
import { extractTextAndMetaFromEPUB } from './epub-to-markdown.service';

const loading = ref(false);
const output = ref('');
const format = ref<'markdown' | 'text'>('markdown');
const metadata = ref<Record<string, any> | null>(null);

const formatOptions = [
  { label: 'Markdown', value: 'markdown' },
  { label: 'Plain Text', value: 'text' },
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
  }
  catch (err: any) {
    output.value = err.toString();
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <n-space justify="center" mb-1>
      <c-select
        v-model:value="format"
        label="Format:"
        label-position="left"
        :options="formatOptions"
        style="width: 180px"
      />
    </n-space>

    <c-file-upload
      title="Drop an EPUB file here or click to select a file"
      accept=".epub"
      mb-2
      :disabled="loading"
      @file-upload="onUpload"
    />

    <!-- Metadata -->
    <n-card v-if="metadata" title="Metadata" mb-1>
      <input-copyable label="Title:" label-position="left" label-width="100px" mb-1 :value="metadata.title" />
      <input-copyable label="Creator:" label-position="left" label-width="100px" mb-1 :value="metadata.creator" />
      <input-copyable label="Language:" label-position="left" label-width="100px" mb-1 :value="metadata.language" />
      <input-copyable label="Publisher:" label-position="left" label-width="100px" mb-1 :value="metadata.publisher" />
      <input-copyable label="Identifier:" label-position="left" label-width="100px" mb-1 :value="metadata.identifier" />
      <input-copyable label="Rights:" label-position="left" label-width="100px" mb-1 :value="metadata.rights" />
      <input-copyable label="Description:" label-position="left" label-width="100px" mb-1 :value="metadata.description" />
    </n-card>

    <n-space justify="center">
      <NSpin v-if="loading" />
    </n-space>

    <n-card v-if="output" title="Epub Content">
      <textarea-copyable
        :value="output"
        :language="format"
        download-file-name="book.md"
      />
    </n-card>
  </div>
</template>
