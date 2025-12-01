<script setup lang="ts">
import { Base64 } from 'js-base64';
import createGSModule from 'ghostscript-wasm-esm';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const quality = ref('screen');
const compatibility = ref('1.4');

const qualityOptions = [
  { label: 'Screen (smallest)', value: 'screen' },
  { label: 'eBook (balanced)', value: 'ebook' },
  { label: 'Printer (high quality)', value: 'printer' },
  { label: 'Prepress (best quality)', value: 'prepress' },
];

const compatibilityOptions = [
  { label: 'PDF 1.4', value: '1.4' },
  { label: 'PDF 1.5', value: '1.5' },
  { label: 'PDF 1.6', value: '1.6' },
  { label: 'PDF 1.7', value: '1.7' },
];

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const file = ref<File | null>(null);

const base64OutputPDF = ref('');
const logs = ref<string[]>([]);
const fileName = ref('');
const fileExtension = ref('pdf');
const { download } = useDownloadFileFromBase64(
  {
    source: base64OutputPDF,
    filename: fileName,
    extension: fileExtension,
  });
const gsCommand = ref('');

async function onFileUploaded(uploadedFile: File) {
  file.value = uploadedFile;
  const fileBuffer = await uploadedFile.arrayBuffer();

  fileName.value = `compressed_${uploadedFile.name}`;
  status.value = 'processing';
  try {
    const outPdfBuffer = await callMainWithInOutPdf(fileBuffer,
      [
        '-sDEVICE=pdfwrite',
        `-dCompatibilityLevel=${compatibility.value}`,
        `-dPDFSETTINGS=/${quality.value}`,
        '-dNOPAUSE',
        '-dQUIET',
        '-dBATCH',
        '-sOutputFile=out.pdf',
        'in.pdf',
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

const base = import.meta.env.BASE_URL ?? '/';

async function callMainWithInOutPdf(data: ArrayBuffer, args: string[], expected_exitcode: number) {
  gsCommand.value = args.join(' ');
  logs.value = [];
  const mod = await createGSModule({
    locateFile(file: string) {
      return base + file;
    },
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
    <c-select
      v-model:value="quality"
      label="Compression quality:"
      label-position="left"
      label-width="150px"
      :options="qualityOptions"
      placeholder="Select compression quality"
      :disabled="status === 'processing'"
      mb-1
    />

    <c-select
      v-model:value="compatibility"
      label="Compatibility level:"
      label-position="left"
      label-width="150px"
      :options="compatibilityOptions"
      placeholder="Select compatibility level"
      :disabled="status === 'processing'"
      mb-4
    />

    <div style="flex: 0 0 100%">
      <div mx-auto max-w-600px>
        <c-file-upload title="Drag and drop a PDF file here, or click to select a file" accept=".pdf" @file-upload="onFileUploaded" />
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

    <c-card title="Logs">
      <input-copyable label="Ghostscript" :value="gsCommand" mb-1 />
      <pre>{{ logs.join('\n') }}</pre>
    </c-card>
  </div>
</template>
