<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Base64 } from 'js-base64';
import createQPDFModule from 'qpdf-wasm-esm-embedded';
import { IconChevronDown, IconChevronUp, IconCircleMinus } from '@tabler/icons-vue';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const { t } = useI18n();

const fileInputs = ref<Array<{ file: File; range: string }>>([]);
function onUploads(files: Array<File>) {
  fileInputs.value = [...fileInputs.value, ...(files.map(f => ({ file: f, range: '' })))];
}

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');

const base64OutputPDF = ref('');
const logs = ref<string[]>([]);
const fileName = ref('concat.pdf');
const { download } = useDownloadFileFromBase64(
  {
    source: base64OutputPDF,
    filename: fileName,
  });
const qpdfCommand = ref('');

async function onProcessClicked() {
  const fileInputsValue = fileInputs.value;
  if (!fileInputsValue.length) {
    return;
  }

  const fileBuffers: Array<ArrayBuffer> = [];
  for (const file of fileInputsValue) {
    fileBuffers.push(await file.file.arrayBuffer());
  }

  status.value = 'processing';
  try {
    const options = [
      '--empty',
      '--pages',
    ];
    for (let i = 0; i < fileInputsValue.length; i++) {
      options.push(`in${i}.pdf`);
      if (fileInputsValue[i].range) {
        options.push(`${fileInputsValue[i].range}`);
      }
      else {
        options.push('1-z');
      }
    }
    options.push('--');
    options.push('out.pdf');
    const outPdfBuffer = await callMainWithManyInOutPdf(fileBuffers,
      options, 0);
    base64OutputPDF.value = `data:application/pdf;base64,${Base64.fromUint8Array(outPdfBuffer)}`;
    status.value = 'done';

    download();
  }
  catch (e) {
    status.value = 'error';
  }
}

async function callMainWithManyInOutPdf(input_files: Array<ArrayBuffer>, args: string[], expected_exitcode: number) {
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
  for (let i = 0; i < input_files.length; i++) {
    mod.FS.writeFile(`in${i}.pdf`, new Uint8Array(input_files[i]));
  }
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
      <div mx-auto mb-2 max-w-600px>
        <c-file-upload
          :title="t('tools.pdf-concat.texts.title-drag-and-drop-a-pdf-files-here-or-click-to-select-some-files')"
          multiple
          accept=".pdf"
          @files-upload="onUploads"
        />
        <div mt-2 text-center>
          <c-input-text :value="fileName" :label="t('tools.pdf-concat.texts.label-output-file')" label-position="left" />
        </div>
      </div>

      <c-card v-if="fileInputs" :title="t('tools.pdf-concat.texts.title-files-order')">
        <n-dynamic-input
          v-model:value="fileInputs"
          show-sort-button
          w-full
          :insertion-disabled="true"
          :create-button-props="{ id: 'pdf-concat-create' }"
        >
          <template #action="{ index, remove, move }">
            <div ml-1 flex gap-1>
              <n-button @click="() => remove(index)">
                <n-icon size="25" :component="IconCircleMinus" />
              </n-button>
              <n-button :disabled="index === 0" @click="() => move('up', index)">
                <n-icon size="25" :component="IconChevronUp" />
              </n-button>
              <n-button :disabled="index === fileInputs.length - 1" @click="() => move('down', index)">
                <n-icon size="25" :component="IconChevronDown" />
              </n-button>
            </div>
          </template>
          <template #default="{ value }">
            <div w-full flex flex-wrap items-center gap-1>
              <input-copyable readonly :value="value.file.name" />
              <c-input-text
                v-model:value="value.range"
                :label="t('tools.pdf-concat.texts.label-range')"
                label-position="left"
                :placeholder="t('tools.pdf-concat.texts.placeholder-qpdf-range')"
                mb-2
              />
            </div>
          </template>
        </n-dynamic-input>
      </c-card>
    </div>

    <n-p>
      {{ t('tools.pdf-concat.texts.tag-for-details-about-range-options-see') }}<n-a target="_blank" href="https://qpdf.readthedocs.io/en/stable/cli.html#page-selection">
        {{ t('tools.pdf-concat.texts.tag-qpdf-documentation') }}
      </n-a>
    </n-p>

    <div mt-3 flex justify-center>
      <c-button :disabled="!fileInputs" @click="onProcessClicked()">
        {{ t('tools.pdf-concat.texts.tag-concat-pdfs') }}
      </c-button>
    </div>

    <n-divider />

    <div mt-3 flex justify-center>
      <c-alert v-if="status === 'error'" type="error">
        An error occured processing {{ fileName }}
      </c-alert>
      <n-spin
        v-if="status === 'processing'"
        size="small"
      />
    </div>

    <c-card :title="t('tools.pdf-concat.texts.title-logs')">
      <input-copyable :label="t('tools.pdf-concat.texts.label-qpdf')" :value="qpdfCommand" mb-1 />
      <pre>{{ logs.join('\n') }}</pre>
    </c-card>
  </div>
</template>

<style scoped>
::v-deep(#pdf-concat-create) { display: none; }
</style>
