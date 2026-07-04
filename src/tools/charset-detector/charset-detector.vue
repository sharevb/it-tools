<script setup lang="ts">
import { Buffer } from 'node:buffer';
import { useI18n } from 'vue-i18n';
import chardet from 'chardet';
import iconv from 'iconv-lite';

const { t } = useI18n();

const inputType = ref<'file' | 'content'>('file');
const fileContent = ref('');
const fileInput = ref() as Ref<File | null>;
const error = ref('');
const contentDecoded = ref('');

async function getUInt8ArrayFromInputs() {
  const fileContentValue = fileContent.value;
  const file = fileInput.value;
  if (inputType.value === 'file' && file) {
    return new Uint8Array(await file.arrayBuffer());
  }
  else if (inputType.value === 'content' && fileContentValue) {
    const uint8Array = new Uint8Array(fileContentValue.length);
    for (let i = 0; i < fileContentValue.length; i++) {
      uint8Array[i] = fileContentValue.charCodeAt(i);
    }
    return uint8Array;
  }
  else {
    return null;
  }
}

const encodings = computedAsync(async () => {
  error.value = '';
  try {
    const buffer = await getUInt8ArrayFromInputs();
    if (buffer === null) {
      return null;
    }
    return chardet.analyse(buffer);
  }
  catch (e: any) {
    error.value = e.toString();
    return null;
  }
});

async function generateEncodedOutput(encoding: string) {
  error.value = '';
  contentDecoded.value = '';
  try {
    const buffer = await getUInt8ArrayFromInputs();
    if (buffer === null) {
      return;
    }
    contentDecoded.value = iconv.decode(Buffer.from(buffer), encoding);
  }
  catch (e: any) {
    return e.toString();
  }
}

function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}
</script>

<template>
  <div style="max-width: 600px;">
    <c-card :title="t('tools.charset-detector.texts.title-input')" mb-2>
      <n-radio-group v-model:value="inputType" name="radiogroup" mb-2 flex justify-center>
        <n-space>
          <n-radio
            value="file"
            :label="t('tools.charset-detector.texts.label-file')"
          />
          <n-radio
            value="content"
            :label="t('tools.charset-detector.texts.label-content')"
          />
        </n-space>
      </n-radio-group>

      <c-file-upload
        v-if="inputType === 'file'"
        :title="t('tools.charset-detector.texts.title-drag-and-drop-txt-file-here-or-click-to-select-a-file')"
        @file-upload="onUpload"
      />

      <c-input-text
        v-if="inputType === 'content'"
        v-model:value="fileContent"
        :label="t('tools.charset-detector.texts.label-file-content')"
        multiline
        :placeholder="t('tools.charset-detector.texts.placeholder-put-your-text-content-here')"
        rows="15"
        mb-2
      />
    </c-card>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <c-card v-if="!error && encodings" :title="t('tools.charset-detector.texts.title-possible-encodings')">
      <n-table>
        <thead>
          <tr>
            <th scope="col">
              {{ t('tools.charset-detector.texts.tag-confidence') }}
            </th>
            <th scope="col">
              {{ t('tools.charset-detector.texts.tag-name') }}
            </th>
            <th scope="col">
              {{ t('tools.charset-detector.texts.tag-lang') }}
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(enc, index) in encodings || []"
            :key="index"
          >
            <td>
              {{ enc.confidence }}
            </td>
            <td>
              {{ enc.name }}
            </td>
            <td>
              {{ enc.lang }}
            </td>
            <td>
              <n-button @click="generateEncodedOutput(enc.name.toLocaleLowerCase())">
                {{ t('tools.charset-detector.texts.tag-decode') }}
              </n-button>
            </td>
          </tr>
        </tbody>
      </n-table>

      <n-card v-if="contentDecoded" :title="t('tools.charset-detector.texts.title-decoded-text')" mb-1>
        <textarea-copyable :value="contentDecoded" />
      </n-card>
    </c-card>
  </div>
</template>
