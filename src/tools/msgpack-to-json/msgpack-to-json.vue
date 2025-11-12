<script setup lang="ts">
import { Buffer } from 'node:buffer';
import { unpack } from 'msgpackr';
import hexArray from 'hex-array';

const inputType = ref<'file' | 'content'>('file');
const fileInput = ref() as Ref<File | null>;
const hexInput = ref('');

const error = ref('');

const results = computedAsync(async () => {
  error.value = '';
  try {
    if (inputType.value === 'file') {
      const file = fileInput.value;
      if (file == null) {
        return null;
      }
      return unpack(Buffer.from(await file.arrayBuffer()));
    }
    else {
      return unpack(hexArray.fromString(hexInput.value));
    }
  }
  catch (e: any) {
    error.value = e.toString();
    return [];
  }
});
const resultsJson = computed(() => JSON.stringify(results.value || [], (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));

function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}
</script>

<template>
  <div>
    <c-card title="Input Message Pack file or content" mb-2>
      <n-radio-group v-model:value="inputType" name="radiogroup" mb-2 flex justify-center>
        <n-space>
          <n-radio
            value="file"
            label="File"
          />
          <n-radio
            value="content"
            label="Hex Content"
          />
        </n-space>
      </n-radio-group>

      <c-file-upload
        v-if="inputType === 'file'"
        title="Drag and drop MsgPack file here, or click to select a file"
        @file-upload="onUpload"
      />

      <c-input-text
        v-if="inputType === 'content'"
        v-model:value="hexInput"
        label="Hex Content:"
        multiline
      />
    </c-card>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <c-card title="JSON Content">
      <textarea-copyable :value="resultsJson" language="json" :download-file-name="`${fileInput?.name}.json`" />
    </c-card>
  </div>
</template>
