<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Base64 } from 'js-base64';
import createQPDFModule from 'qpdf-wasm-esm-embedded';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const { t } = useI18n();

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const file = ref<File | null>(null);

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
  const fileBuffer = await uploadedFile.arrayBuffer();

  fileName.value = `decrypted_${uploadedFile.name}`;
  status.value = 'processing';
  try {
    const outPdfBuffer = await callMainWithInOutPdf(fileBuffer,
      [
        '--decrypt',
        '--warning-exit-0',
        '--verbose',
        'in.pdf',
        'out.pdf',
      ],
      0);
    base64OutputPDF.value = `data:application/pdf;base64,${Base64.fromUint8Array(outPdfBuffer)}`;
    status.value = 'done';

    download();
  }
  catch (e) {
    status.value = 'error';
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
    throw new Error('Process run failed');
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

    <div mt-3 flex justify-center>
      <c-alert v-if="status === 'error'" type="error">
        An error occured processing {{ fileName }}
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
