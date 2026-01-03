<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import * as XLSX from 'xlsx';
import JSON5 from 'json5';

import { objectArrayToData } from '@/utils/objectarray.export';
import type { ExportFormat } from '@/utils/objectarray.export';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const inputType = ref<'file' | 'content'>('content');
const jsonContent = ref('');
const fileInput = ref() as Ref<File | null>;
const error = ref('');

const convertedData = ref<string>('');
const selectedFormat = useQueryParamOrStorage({ name: 'fmt', storageName: 'csv-to-data:fmt', defaultValue: 'yaml' });
const tableName = useQueryParamOrStorage({ name: 'table', storageName: 'csv-to-data:tbl', defaultValue: 'TableName' });
const nestify = ref(false);

const formats = [
  { label: t('tools.csv-to-data.texts.label-yaml'), value: 'yaml' },
  { label: t('tools.csv-to-data.texts.label-sql-insert'), value: 'sql' },
  { label: t('tools.csv-to-data.texts.label-csv-comma'), value: 'csv' },
  { label: t('tools.csv-to-data.texts.label-csv-semicolon'), value: 'csv_semicolon' },
  { label: t('tools.csv-to-data.texts.label-csv-tab'), value: 'tsv' },
  { label: t('tools.csv-to-data.texts.label-markdown'), value: 'markdown' },
  { label: t('tools.csv-to-data.texts.label-xml'), value: 'xml' },
  { label: t('tools.csv-to-data.texts.label-xlsx'), value: 'xlsx' },
];

async function handleFileUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}

function readFileAsString(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result as string || '');
    };
    fr.onerror = reject;
    fr.readAsText(file);
  });
}

async function convertFile() {
  let jsonContentValue = jsonContent.value;
  const file = fileInput.value;
  error.value = '';
  try {
    if (inputType.value === 'file' && file) {
      jsonContentValue = await readFileAsString(file);
    }

    let data = JSON5.parse(jsonContentValue);
    if (!Array.isArray(data)) {
      data = [data];
    }
    const outFormat = selectedFormat.value;
    if (outFormat === 'xlsx') {
      convertedData.value = '';
      downloadXLSX(data, tableName.value);
    }
    else {
      convertedData.value = objectArrayToData(data, outFormat as ExportFormat, {
        tableName: tableName.value,
        nestify: nestify.value,
      });
    }
  }
  catch (e: any) {
    error.value = e.toString();
    return null;
  }
};

function downloadXLSX<T extends Record<string, any>>(data: T[], fileName: string = 'data') {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, fileName);

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
</script>

<template>
  <NCard :title="t('tools.json-to-data.texts.title-json-converter')">
    <c-card>
      <n-radio-group v-model:value="inputType" name="radiogroup" mb-2 flex justify-center>
        <n-space>
          <n-radio
            value="file"
            :label="t('tools.csv-to-data.texts.label-file')"
          />
          <n-radio
            value="content"
            :label="t('tools.csv-to-data.texts.label-content')"
          />
        </n-space>
      </n-radio-group>

      <c-file-upload
        v-if="inputType === 'file'"
        accept=".csv,.tsv"
        :title="t('tools.json-to-data.texts.title-drag-and-drop-a-json-file-here-or-click-to-select-a-file')"
        @file-upload="handleFileUpload"
      />

      <c-input-text
        v-if="inputType === 'content'"
        v-model:value="jsonContent"
        :label="t('tools.json-to-data.texts.label-paste-your-json-content')"
        :placeholder="t('tools.json-to-data.texts.placeholder-your-json')"
        multiline
        rows="8"
        data-test-id="input"
      />
    </c-card>

    <n-space justify="center">
      <n-form-item :label="t('tools.csv-to-data.texts.label-nestify-a-b-c-to-nested-objects')" label-placement="left">
        <n-checkbox v-model:checked="nestify" />
      </n-form-item>
    </n-space>

    <NFormItem :label="t('tools.csv-to-data.texts.label-select-output-format')" label-placement="left">
      <NSelect v-model:value="selectedFormat" :options="formats" :placeholder="t('tools.csv-to-data.texts.placeholder-select-format')" />
    </NFormItem>

    <c-input-text v-if="selectedFormat === 'sql'" v-model:value="tableName" :label="t('tools.csv-to-data.texts.label-table-name')" label-placement="left" />

    <div mt-3 flex justify-center>
      <NButton :disabled="!((inputType === 'file' && fileInput) || jsonContent)" @click="convertFile">
        {{ t('tools.csv-to-data.texts.tag-convert') }}
      </NButton>
    </div>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <c-card v-if="convertedData" :title="t('tools.csv-to-data.texts.title-converted-data')">
      <textarea-copyable :value="convertedData" :language="selectedFormat" :download-file-name="`output.${selectedFormat}`" />
    </c-card>
  </NCard>
</template>
