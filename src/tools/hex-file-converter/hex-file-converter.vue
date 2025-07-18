<script setup lang="ts">
import { Buffer } from 'node:buffer';
import { useI18n } from 'vue-i18n';
import type { Ref } from 'vue';
import { useCopy } from '@/composable/copy';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const { t } = useI18n();

const fileName = ref('');
const fileExtension = ref('');
const hexInput = ref('');
const base64Input = computed(() => {
  const hexString = hexInput.value?.replace(/^(?:0x|&H|\\x)/gi, '').replace(/[^\da-f]/gi, '');
  try {
    return `data:application/octet-stream;base64,${Buffer.from(hexString, 'hex').toString('base64')}`;
  }
  catch {
    return '';
  }
});
const { download } = useDownloadFileFromBase64(
  {
    source: base64Input,
    filename: fileName,
    extension: fileExtension,
  });

function downloadFile() {
  try {
    download();
  }
  catch (_) {
    //
  }
}

function buf2hex(buffer: ArrayBuffer, separator: string): string {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join(separator);
}

async function ReadFileAsHex(file: File, separator: string = ' '): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(buf2hex(reader.result as ArrayBuffer, separator));
    };
    reader.onerror = () => reject(reader.error?.toString());
    reader.readAsArrayBuffer(file);
  });
}

const separator = useStorage('hex-converter:sep', ' ');
const fileInput = ref() as Ref<File>;
const prefix = useStorage('hex-converter:prefix', '');
const fileHex = computedAsync(async () => {
  const file = fileInput.value;
  const sep = separator.value;
  const pref = prefix.value;

  return pref + await ReadFileAsHex(file, sep);
});
const { copy: copyFileHex } = useCopy({ source: fileHex, text: t('tools.hex-file-converter.texts.text-hex-string-copied-to-the-clipboard') });

function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}
</script>

<template>
  <c-card :title="t('tools.hex-file-converter.texts.title-hex-to-file')">
    <n-grid cols="3" x-gap="12">
      <n-gi span="2">
        <c-input-text
          v-model:value="fileName"
          :label="t('tools.hex-file-converter.texts.label-file-name')"
          :placeholder="t('tools.hex-file-converter.texts.placeholder-download-filename')"
          mb-2
        />
      </n-gi>
      <n-gi>
        <c-input-text
          v-model:value="fileExtension"
          :label="t('tools.hex-file-converter.texts.label-extension')"
          :placeholder="t('tools.hex-file-converter.texts.placeholder-extension')"
        />
      </n-gi>
    </n-grid>

    <n-form-item :label="t('tools.hex-file-converter.texts.label-content-in-hex')">
      <c-input-text
        v-model:value="hexInput"
        multiline
        :placeholder="t('tools.hex-file-converter.texts.placeholder-put-your-hex-file-string-here')"
        rows="5"
      />
    </n-form-item>

    <n-divider />

    <div flex justify-center>
      <c-button :disabled="hexInput === ''" @click="downloadFile()">
        {{ t('tools.hex-file-converter.texts.tag-download-file') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.hex-file-converter.texts.title-file-to-hex')">
    <c-file-upload
      :title="t('tools.hex-file-converter.texts.title-drag-and-drop-a-file-here-or-click-to-select-a-file')"
      mb-2
      @file-upload="onUpload"
    />

    <c-input-text
      v-model:value="separator"
      :label="t('tools.hex-file-converter.texts.label-separator')"
      label-position="left"
      :placeholder="t('tools.hex-file-converter.texts.placeholder-separator')"
      mb-2
    />

    <c-input-text
      v-model:value="prefix"
      :label="t('tools.hex-file-converter.texts.label-prefix')"
      label-position="left"
      :placeholder="t('tools.hex-file-converter.texts.placeholder-enter-a-prefix-ie-0x-h-or-empty')"
      mb-2
    />

    <n-divider />

    <n-form-item :label="t('tools.hex-file-converter.texts.label-file-in-hex')">
      <c-input-text
        :value="fileHex"
        multiline readonly
        :placeholder="t('tools.hex-file-converter.texts.placeholder-file-in-hex-will-be-here')"
        rows="5" mb-2
      />
    </n-form-item>

    <div flex justify-center>
      <c-button @click="copyFileHex()">
        {{ t('tools.hex-file-converter.texts.tag-copy') }}
      </c-button>
    </div>
  </c-card>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
