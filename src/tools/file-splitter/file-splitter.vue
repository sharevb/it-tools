<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { splitContent } from './file-splitter.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const splitMode = useQueryParamOrStorage<'lines' | 'nodes'>({ name: 'mode', storageName: 'file-split:m', defaultValue: 'lines' });
const strategy = useQueryParamOrStorage<'maxSize' | 'fixedCount' | 'chunkCount'>({ name: 'strategy', storageName: 'file-split:s', defaultValue: 'fixedCount' });
const count = useQueryParamOrStorage({ name: 'count', storageName: 'file-split:c', defaultValue: 100 });
const extension = ref('');
const preview = ref(false);
const error = ref('');
const fileContent = ref('');
const chunks = ref<string[]>([]);

async function prepareChunks() {
  error.value = '';
  const splitModeValue = splitMode.value;
  const countValue = count.value;
  const strategyValue = strategy.value;
  const fileContentValue = fileContent.value;
  if (!fileContentValue) {
    return [];
  }
  try {
    chunks.value = await new Promise((resolve, reject) => {
      try {
        resolve(splitContent(
          fileContentValue,
          splitModeValue,
          (strategyValue === 'maxSize' ? 1024 : 1) * countValue,
          strategyValue));
      }
      catch (e: any) {
        reject(e);
      }
    });
  }
  catch (err: any) {
    error.value = err.toString();
    chunks.value = [];
  }
}

function readFileAsString(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result as string || '');
    };
    fr.onerror = reject;
    fr.readAsText(file);
  });
}

async function onFileUploaded(uploadedFile: File) {
  extension.value = uploadedFile.name?.split('.').pop() || 'txt';
  fileContent.value = await readFileAsString(uploadedFile);
}

function downloadChunk(index: number) {
  const blob = new Blob([chunks.value[index]], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chunk-${index + 1}.${extension.value}`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadAllChunks() {
  for (let i = 0; i < chunks.value.length; i++) {
    downloadChunk(i);
  }
}
</script>

<template>
  <div>
    <n-space justify="center" mb-2>
      <NRadioGroup v-model:value="splitMode">
        <NRadio value="lines">
          {{ t('tools.file-splitter.texts.tag-split-by-lines') }}
        </NRadio>
        <NRadio value="nodes">
          {{ t('tools.file-splitter.texts.tag-split-by-nodes') }}
        </NRadio>
      </NRadioGroup>
    </n-space>
    <n-space justify="center" align="baseline" mb-2>
      <NRadioGroup v-model:value="strategy">
        <NRadio value="maxSize">
          {{ t('tools.file-splitter.texts.tag-max-chunk-size-kb') }}
        </NRadio>
        <NRadio value="fixedCount">
          {{ t('tools.file-splitter.texts.tag-fixed-count') }}
        </NRadio>
        <NRadio value="chunkCount">
          {{ t('tools.file-splitter.texts.tag-chunk-count') }}
        </NRadio>
      </NRadioGroup>
      <NInputNumber v-model:value="count" :min="1" :placeholder="t('tools.file-splitter.texts.placeholder-strategy-value')" style="width: 150px" />
    </n-space>

    <div style="flex: 0 0 100%" mb-2>
      <div mx-auto max-w-600px>
        <c-file-upload
          :title="t('tools.file-splitter.texts.title-drag-and-drop-a-txt-json-or-xml-file-here-or-click-to-select-a-file')"
          accept=".txt,.json,.xml"
          @file-upload="onFileUploaded"
        />
      </div>
    </div>

    <div mb-1 flex justify-center>
      <n-checkbox v-model:checked="preview">
        {{ t('tools.file-splitter.texts.tag-preview-chunks') }}
      </n-checkbox>
    </div>

    <div mb-2 flex justify-center>
      <NButton size="small" @click="prepareChunks()">
        {{ t('tools.file-splitter.texts.tag-process-chunks') }}
      </NButton>
    </div>

    <n-alert v-if="error">
      {{ error }}
    </n-alert>

    <c-card v-if="chunks && chunks.length" :title="`Chunks (${chunks.length})`">
      <div flex justify-center>
        <NButton size="small" @click="downloadAllChunks()">
          {{ t('tools.file-splitter.texts.tag-download-all') }}
        </NButton>
      </div>
      <div v-if="preview">
        <template
          v-for="(chunk, index) in chunks"
          :key="index"
        >
          <n-divider>Chunk {{ index + 1 }}</n-divider>
          <textarea-copyable :value="chunk" :language="extension" style="max-height: 10em" multiline word-wrap mb-1 />
          <div flex justify-center>
            <NButton size="small" @click="downloadChunk(index)">
              {{ t('tools.file-splitter.texts.tag-download') }}
            </NButton>
          </div>
        </template>
      </div>
    </c-card>
  </div>
</template>
