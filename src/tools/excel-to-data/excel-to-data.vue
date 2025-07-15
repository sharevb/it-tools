<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import * as XLSX from 'xlsx';
import { objectArrayToData } from '@/utils/objectarray.export';
import type { ExportFormat } from '@/utils/objectarray.export';

const { t } = useI18n();

const workbook = ref<XLSX.WorkBook | null>(null);
const convertedData = ref<string>('');
const selectedFormat = ref<string>('json');
const tableName = ref<string>('TableName');
const nestify = ref(false);
const sheetName = ref('');
const error = ref('');

const formats = [
  { label: t('tools.excel-to-data.texts.label-json'), value: 'json' },
  { label: t('tools.excel-to-data.texts.label-yaml'), value: 'yaml' },
  { label: t('tools.excel-to-data.texts.label-sql-insert'), value: 'sql' },
  { label: t('tools.excel-to-data.texts.label-csv-comma'), value: 'csv' },
  { label: t('tools.excel-to-data.texts.label-csv-semicolon'), value: 'csv_semicolon' },
  { label: t('tools.excel-to-data.texts.label-csv-tab'), value: 'tsv' },
  { label: t('tools.excel-to-data.texts.label-markdown'), value: 'markdown' },
  { label: t('tools.excel-to-data.texts.label-xml'), value: 'xml' },
];

async function handleFileUpload(file: File) {
  error.value = '';
  workbook.value = null;
  sheetName.value = '';
  try {
    workbook.value = XLSX.read(await file.arrayBuffer(), { type: 'binary' });
    sheetName.value = workbook.value.SheetNames[0];
  }
  catch (e: any) {
    error.value = e.toString();
  }
}

function convertFile() {
  if (!workbook.value) {
    return;
  }
  const data = XLSX.utils.sheet_to_json(workbook.value.Sheets[sheetName.value]);
  if (!data.length || !selectedFormat.value) {
    return;
  }

  convertedData.value = objectArrayToData(data, selectedFormat.value as ExportFormat, {
    tableName: tableName.value,
    nestify: nestify.value,
  });
};
</script>

<template>
  <NCard :title="t('tools.excel-to-data.texts.title-xlsx-converter')">
    <c-file-upload
      :title="t('tools.excel-to-data.texts.title-drag-and-drop-a-xlsx-here-or-click-to-select-a-file')"
      accept=".xlsx"
      mb-3
      @file-upload="handleFileUpload"
    />

    <NFormItem v-if="workbook" :label="t('tools.excel-to-data.texts.label-select-sheet-to-use')" label-placement="left">
      <NSelect v-model:value="sheetName" :options="workbook.SheetNames?.map((s) => ({ label: s, value: s }))" :placeholder="t('tools.excel-to-data.texts.placeholder-select-sheet')" />
    </NFormItem>

    <NFormItem :label="t('tools.excel-to-data.texts.label-select-output-format')" label-placement="left">
      <NSelect v-model:value="selectedFormat" :options="formats" :placeholder="t('tools.excel-to-data.texts.placeholder-select-format')" />
    </NFormItem>

    <n-form-item :label="t('tools.excel-to-data.texts.label-nestify-a-b-c-to-nested-objects')" label-placement="left">
      <n-checkbox v-model:checked="nestify" />
    </n-form-item>

    <c-input-text v-if="selectedFormat === 'sql'" v-model:value="tableName" :label="t('tools.excel-to-data.texts.label-table-name')" label-placement="left" />

    <div mt-3 flex justify-center>
      <NButton :disabled="!workbook" @click="convertFile">
        {{ t('tools.excel-to-data.texts.tag-convert') }}
      </NButton>
    </div>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <c-card v-if="convertedData" :title="t('tools.excel-to-data.texts.title-converted-data')">
      <textarea-copyable :value="convertedData" :language="selectedFormat" />
    </c-card>
  </NCard>
</template>
