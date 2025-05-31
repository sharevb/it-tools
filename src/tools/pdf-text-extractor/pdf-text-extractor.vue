<script setup lang="ts">
import { definePDFJSModule, extractText, getDocumentProxy } from 'unpdf';
import * as pdfJS from 'pdfjs-dist';
import pdfJSWorkerURL from 'pdfjs-dist/build/pdf.worker?url';

pdfJS.GlobalWorkerOptions.workerSrc = pdfJSWorkerURL;

// Define the PDF.js build before using any other unpdf method
await definePDFJSModule(() => import('pdfjs-dist'));

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const file = ref<File | null>(null);
const totalPages = ref(0);
const text = ref('');
const errorMessage = ref('');
const mergePages = ref(false);

function onFileUploaded(uploadedFile: File) {
  file.value = uploadedFile;
  totalPages.value = 0;
  text.value = '';
}

async function processPDF() {
  if (!file.value) {
    return;
  }
  status.value = 'idle';
  errorMessage.value = '';
  try {
    status.value = 'processing';
    const fileBuffer = await file.value.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(fileBuffer));
    const data = await extractText(pdf, { mergePages: mergePages.value as never });
    totalPages.value = data.totalPages;
    text.value = Array.isArray(data.text) ? data.text.join('\n') : data.text;
    status.value = 'done';
  }
  catch (e: any) {
    errorMessage.value = e.toString();
    status.value = 'error';
  }
}
</script>

<template>
  <div>
    <div style="flex: 0 0 100%" mb-1>
      <div mx-auto max-w-600px>
        <c-file-upload title="Drag and drop a PDF file here, or click to select a file" accept=".pdf" @file-upload="onFileUploaded" />
      </div>
    </div>

    <div flex justify-center>
      <n-form-item label="Merge pages" label-placement="left">
        <n-checkbox v-model:checked="mergePages" />
      </n-form-item>
    </div>
    <div flex justify-center>
      <c-button mb-1 :disabled="!file" @click="processPDF">
        Extract text
      </c-button>
    </div>

    <div mb-1 mt-3 flex justify-center>
      <c-alert v-if="errorMessage" type="error">
        {{ errorMessage }}
      </c-alert>
      <n-spin
        v-if="status === 'processing'"
        size="small"
      />
    </div>

    <c-card v-if="file && text" title="Output">
      <input-copyable label="File name:" :value="file?.name" mb-1 />
      <textarea-copyable label="Text:" :value="text" mb-1 />
      <input-copyable label="Total Pages:" :value="totalPages.toString()" mb-1 />
    </c-card>
  </div>
</template>
