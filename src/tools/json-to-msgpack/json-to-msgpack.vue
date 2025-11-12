<script setup lang="ts">
import type { Buffer } from 'node:buffer';
import { pack } from 'msgpackr';
import JSON5 from 'json5';
import { useValidation } from '@/composable/validation';

const jsonInput = ref('');
const fileName = ref('');
const error = ref('');
const jsonValidation = useValidation({
  source: jsonInput,
  rules: [
    {
      validator: (v) => {
        return JSON5.parse(v);
      },
      message: 'JSON is invalid',
    },
  ],
});

const msgPackHex = ref('');
const msgPacked = ref<Buffer | null>(null);

function convertToMsgPack() {
  error.value = '';
  msgPackHex.value = '';
  try {
    msgPacked.value = pack(JSON5.parse(jsonInput.value));
    msgPackHex.value = msgPacked.value.toString('hex');
  }
  catch (e: any) {
    error.value = e.toString();
  }
}

function downloadURL(data: string, fileName: string) {
  const a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = 'none';
  a.click();
  a.remove();
}

function downloadBlob(data: Uint8Array, fileName: string) {
  const blob = new Blob([data], {
    type: 'application/octet-stream',
  });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="fileName"
      label="Output filename:"
      label-position="left"
      placeholder="Enter output filename"
      mb-2
    />

    <c-input-text
      v-model:value="jsonInput"
      label="JSON to convert:"
      multiline
      placeholder="Enter JSON to convert..."
      :validation="jsonValidation"
      rows="5"
      mb-2
    />

    <div mb-2 flex justify-center>
      <n-button @click="convertToMsgPack()">
        Convert
      </n-button>
    </div>

    <c-card v-if="msgPackHex" title="MsgPack Binary:">
      <textarea-copyable :value="msgPackHex" mb-3 />

      <div flex justify-center>
        <c-button :disabled="jsonInput === '' || !jsonValidation.isValid" @click="downloadBlob(msgPacked!, fileName)">
          Download MsgPack file
        </c-button>
      </div>
    </c-card>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>
  </div>
</template>
