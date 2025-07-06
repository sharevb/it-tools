<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Base64 } from 'js-base64';
import createQPDFModule from 'qpdf-wasm-esm-embedded';
import { useDownloadFileFromBase64Refs } from '@/composable/downloadBase64';

const { t } = useI18n();

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const file = ref<File | null>(null);

const restrictAccessibility = useStorage('pdf-encrypt:accessibility', false);
const restrictAnnotate = useStorage('pdf-encrypt:annotate', false);
const restrictAssemble = useStorage('pdf-encrypt:assemble', false);
const restrictExtract = useStorage('pdf-encrypt:extract', false);
const restrictForm = useStorage('pdf-encrypt:form', false);
const restrictModifyOther = useStorage('pdf-encrypt:modoth', false);
const clearTextMetadata = useStorage('pdf-encrypt:clearmeta', false);
const restrictModify = useStorage('pdf-encrypt:mod', 'all');
const restrictPrint = useStorage('pdf-encrypt:print', 'full');
const userPassword = ref('');
const ownerPassword = ref('');

const base64OutputPDF = ref('');
const logs = ref<string[]>([]);
const fileName = ref('');
const fileExtension = ref('pdf');
const { download } = useDownloadFileFromBase64Refs(
  {
    source: base64OutputPDF,
    filename: fileName,
    extension: fileExtension,
  });
const qpdfCommand = ref('');

function onFileUploaded(uploadedFile: File) {
  file.value = uploadedFile;
  fileName.value = `encrypted_${file.value.name}`;
}

async function onProcessClicked() {
  if (!file.value) {
    return;
  }
  const fileBuffer = await file.value.arrayBuffer();

  status.value = 'processing';
  try {
    const options = [
      '--verbose',
      '--encrypt',
    ];
    options.push(`${userPassword.value}`);
    options.push(`${ownerPassword.value}`);
    options.push('128');
    options.push('--use-aes=y');
    options.push(`--accessibility=${(restrictAccessibility.value ? 'n' : 'y')}`);
    options.push(`--annotate=${(restrictAnnotate.value ? 'n' : 'y')}`);
    options.push(`--assemble=${(restrictAssemble.value ? 'n' : 'y')}`);
    options.push(`--extract=${(restrictExtract.value ? 'n' : 'y')}`);
    options.push(`--form=${(restrictForm.value ? 'n' : 'y')}`);
    options.push(`--modify-other=${(restrictModifyOther.value ? 'n' : 'y')}`);
    options.push(`--modify=${(restrictModify.value)}`);
    options.push(`--print=${(restrictPrint.value)}`);
    if (clearTextMetadata.value) {
      options.push('--cleartext-metadata');
    }
    options.push('--');
    options.push('in.pdf');
    options.push('out.pdf');
    const outPdfBuffer = await callMainWithInOutPdf(fileBuffer,
      options, 0);
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

const printRestrictionOptions = [{ value: 'none', label: t('tools.pdf-encrypt.texts.label-disallow-printing') },
  { value: 'low', label: t('tools.pdf-encrypt.texts.label-allow-only-low-resolution-printing') },
  { value: 'full', label: t('tools.pdf-encrypt.texts.label-allow-full-printing') },
];
const modificationRestrictionOptions = [
  { value: 'none', label: t('tools.pdf-encrypt.texts.label-allow-no-modifications') },
  { value: 'assembly', label: t('tools.pdf-encrypt.texts.label-allow-document-assembly-only') },
  { value: 'form', label: t('tools.pdf-encrypt.texts.label-allow-document-assembly-only-filling-in-form-fields-and-signing') },
  { value: 'annotate', label: t('tools.pdf-encrypt.texts.label-allow-document-assembly-only-filling-in-form-fields-and-signing-commenting-and-modifying-forms') },
  { value: 'all', label: t('tools.pdf-encrypt.texts.label-allow-full-document-modification') },
];
</script>

<template>
  <div>
    <div style="flex: 0 0 100%">
      <div mx-auto max-w-600px>
        <c-file-upload
          :title="t('tools.pdf-encrypt.texts.title-drag-and-drop-a-pdf-file-here-or-click-to-select-a-file')"
          accept=".pdf"
          @file-upload="onFileUploaded"
        />
        <div mt-2 text-center>
          <strong>{{ t('tools.pdf-encrypt.texts.tag-output-file') }}</strong> {{ fileName }}
        </div>
      </div>
    </div>

    <c-card :title="t('tools.pdf-encrypt.texts.title-permissions')" mb-3 mt-3>
      <n-space>
        <n-checkbox v-model:checked="restrictAccessibility">
          {{ t('tools.pdf-encrypt.texts.tag-restrict-accessibility-usually-ignored') }}
        </n-checkbox>
        <n-checkbox v-model:checked="restrictAnnotate">
          {{ t('tools.pdf-encrypt.texts.tag-restrict-commenting-filling-form-fields') }}
        </n-checkbox>
        <n-checkbox v-model:checked="restrictAssemble">
          {{ t('tools.pdf-encrypt.texts.tag-restrict-document-assembly') }}
        </n-checkbox>
        <n-checkbox v-model:checked="restrictExtract">
          {{ t('tools.pdf-encrypt.texts.tag-restrict-text-graphic-extraction') }}
        </n-checkbox>
        <n-checkbox v-model:checked="restrictForm">
          {{ t('tools.pdf-encrypt.texts.tag-restrict-filling-form-fields') }}
        </n-checkbox>
        <n-checkbox v-model:checked="restrictModifyOther">
          {{ t('tools.pdf-encrypt.texts.tag-restrict-other-modifications') }}
        </n-checkbox>
        <n-checkbox v-model:checked="clearTextMetadata">
          {{ t('tools.pdf-encrypt.texts.tag-prevent-encryption-of-metadata') }}
        </n-checkbox>
      </n-space>
      <c-select
        v-model:value="restrictModify"
        :options="modificationRestrictionOptions"
        :label="t('tools.pdf-encrypt.texts.label-control-modify-access-by-level')"
        mt-3
      />
      <c-select
        v-model:value="restrictPrint"
        :options="printRestrictionOptions"
        :label="t('tools.pdf-encrypt.texts.label-control-printing-access')"
        mt-3
      />
    </c-card>
    <n-form-item
      :label="t('tools.pdf-encrypt.texts.label-owner-password')"
      label-placement="left"
      mb-1
    >
      <n-input
        :value="ownerPassword"
        type="password"
        :placeholder="t('tools.pdf-encrypt.texts.placeholder-owner-password-optional')"
      />
    </n-form-item>

    <n-form-item
      :label="t('tools.pdf-encrypt.texts.label-user-password')"
      label-placement="left"
      mb-1
    >
      <n-input
        :value="userPassword"
        type="password"
        :placeholder="t('tools.pdf-encrypt.texts.placeholder-user-password-optional')"
      />
    </n-form-item>

    <div mt-3 flex justify-center>
      <c-button :disabled="!file" @click="onProcessClicked()">
        {{ t('tools.pdf-encrypt.texts.tag-encrypt-pdf') }}
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

    <c-card :title="t('tools.pdf-encrypt.texts.title-logs')">
      <input-copyable :label="t('tools.pdf-encrypt.texts.label-qpdf')" :value="qpdfCommand" mb-1 />
      <pre>{{ logs.join('\n') }}</pre>
    </c-card>
  </div>
</template>
