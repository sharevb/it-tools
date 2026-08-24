<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Base64 } from 'js-base64';
import createQPDFModule from 'qpdf-wasm-esm-embedded';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const { t } = useI18n();

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const file = ref<File | null>(null);
const usePassword = ref(false);
const password = ref('');
const fileBuffer = ref<ArrayBuffer | null>(null);
const isPasswordError = ref(false);

const base64OutputPDF = ref('');
const fileName = ref('');
const logs = ref<string[]>([]);
const fileExtension = ref('pdf');
const { download } = useDownloadFileFromBase64(
  {
    source: base64OutputPDF,
    filename: fileName,
    extension: fileExtension,
  });
const qpdfCommand = ref('');

async function onPDFFileUploaded(uploadedFile: File) {
  file.value = uploadedFile;
  fileName.value = `decrypted_${uploadedFile.name}`;
  fileBuffer.value = await uploadedFile.arrayBuffer();
  isPasswordError.value = false;
  processFile();
}

async function processFile() {
  if (!fileBuffer.value) {
    return;
  }

  status.value = 'processing';
  try {
    const args = ['--decrypt'];
    if (usePassword.value) {
      args.push(`--password=${password.value}`);
    }
    args.push('--warning-exit-0');
    args.push('--verbose');
    args.push('in.pdf');
    args.push('out.pdf');
    const outPdfBuffer = await callMainWithInOutPdf(fileBuffer.value, args, 0);
    base64OutputPDF.value = `data:application/pdf;base64,${Base64.fromUint8Array(outPdfBuffer)}`;
    status.value = 'done';
    download();
    fileBuffer.value = null;
    usePassword.value = false;
    password.value = '';
    isPasswordError.value = false;
  }
  catch (e) {
    status.value = 'error';
    const errorLog = logs.value.join('\n').toLowerCase();
    isPasswordError.value = errorLog.includes('password') || errorLog.includes('encrypted');
  }
}

async function callMainWithInOutPdf(data: ArrayBuffer, args: string[], expected_exitcode: number) {
  qpdfCommand.value = args.join(' ');
  logs.value = [];
  const mod = await createQPDFModule({
    print(text: string) {
      logs.value.push(text);
    },
    printErr(text: string) {
      logs.value.push(text);
    },
  });
  mod.FS.writeFile('in.pdf', new Uint8Array(data));
  const ret = mod.callMain(args);
  if (expected_exitcode !== ret) {
    throw new Error(t('tools.pdf-compressor.texts.process-run-failed'));
  }
  return mod.FS.readFile('out.pdf');
}
</script>

<template>
  <div>
    <div style="flex: 0 0 100%">
      <div mx-auto max-w-600px>
        <c-file-upload :title="t('tools.pdf-unlock.texts.title-drag-and-drop-a-pdf-file-here-or-click-to-select-a-file')" accept=".pdf" @file-upload="onPDFFileUploaded" />
      </div>
    </div>

    <div v-if="isPasswordError">
      <n-checkbox v-model:checked="usePassword" mb-2 mt-3>
        {{ t('tools.pdf-unlock.texts.label-password') }}
      </n-checkbox>

      <n-form-item
        v-if="usePassword"
        :label="t('tools.pdf-unlock.texts.label-password')"
        label-placement="left"
        mb-1
        mt-2
      >
        <n-input
          v-model:value="password"
          type="password"
          :placeholder="t('tools.pdf-unlock.texts.placeholder-password')"
        />
      </n-form-item>

      <div mt-3 flex justify-center>
        <c-button @click="processFile()">
          {{ t('tools.pdf-unlock.texts.tag-decrypt-pdf') }}
        </c-button>
      </div>
    </div>

    <div mt-3 flex justify-center>
      <c-alert v-if="status === 'error'" type="error">
        {{ $t('tools.file-type.texts.an-error-occured-processing') }} <span>{{ fileName }}</span>
      </c-alert>
      <n-spin
        v-if="status === 'processing'"
        size="small"
      />
    </div>

    <c-card :title="t('tools.pdf-unlock.texts.title-logs')">
      <input-copyable :label="t('tools.pdf-unlock.texts.label-qpdf')" :value="qpdfCommand" mb-1 />
      <pre>{{ logs.join('\n') }}</pre>
    </c-card>
  </div>
</template>
