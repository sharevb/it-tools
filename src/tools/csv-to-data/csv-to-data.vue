<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { convertCsvToArray } from '../csv-to-json/csv-to-json.service';
import { objectArrayToData } from '@/utils/objectarray.export';
import type { ExportFormat } from '@/utils/objectarray.export';

const { t } = useI18n();

const inputType = ref<'file' | 'content'>('file');
const csvContent = ref('');
const fileInput = ref() as Ref<File | null>;
const error = ref('');

const convertedData = ref<string>('');
const selectedFormat = ref<string>('json');
const tableName = ref<string>('TableName');
const nestify = ref(false);
const typedValues = ref(false);

const formats = [
  { label: t('tools.csv-to-data.texts.label-json'), value: 'json' },
  { label: t('tools.csv-to-data.texts.label-yaml'), value: 'yaml' },
  { label: t('tools.csv-to-data.texts.label-sql-insert'), value: 'sql' },
  { label: t('tools.csv-to-data.texts.label-csv-comma'), value: 'csv' },
  { label: t('tools.csv-to-data.texts.label-csv-semicolon'), value: 'csv_semicolon' },
  { label: t('tools.csv-to-data.texts.label-csv-tab'), value: 'tsv' },
  { label: t('tools.csv-to-data.texts.label-markdown'), value: 'markdown' },
  { label: t('tools.csv-to-data.texts.label-xml'), value: 'xml' },
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
  let csvContentValue = csvContent.value;
  const file = fileInput.value;
  error.value = '';
  try {
    if (inputType.value === 'file' && file) {
      csvContentValue = await readFileAsString(file);
    }

    const data = convertCsvToArray(csvContentValue, typedValues.value);
    convertedData.value = objectArrayToData(data, selectedFormat.value as ExportFormat, {
      tableName: tableName.value,
      nestify: nestify.value,
    });
  }
  catch (e: any) {
    error.value = e.toString();
    return null;
  }
};
</script>

<template>
  <NCard :title="t('tools.csv-to-data.texts.title-csv-converter')">
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
        :title="t('tools.csv-to-data.texts.title-drag-and-drop-a-csv-file-here-or-click-to-select-a-file')"
        @file-upload="handleFileUpload"
      />

      <c-input-text
        v-if="inputType === 'content'"
        v-model:value="csvContent"
        :label="t('tools.csv-to-data.texts.label-paste-your-csv-content')"
        :placeholder="t('tools.csv-to-data.texts.placeholder-your-csv')"
        multiline
        rows="8"
        data-test-id="input"
      />
    </c-card>

    <n-space justify="center">
      <n-form-item :label="t('tools.csv-to-data.texts.label-typed-values')" label-placement="left">
        <n-checkbox v-model:checked="typedValues" />
      </n-form-item>
      <n-form-item :label="t('tools.csv-to-data.texts.label-nestify-a-b-c-to-nested-objects')" label-placement="left">
        <n-checkbox v-model:checked="nestify" />
      </n-form-item>
    </n-space>

    <NFormItem :label="t('tools.csv-to-data.texts.label-select-output-format')" label-placement="left">
      <NSelect v-model:value="selectedFormat" :options="formats" :placeholder="t('tools.csv-to-data.texts.placeholder-select-format')" />
    </NFormItem>

    <c-input-text v-if="selectedFormat === 'sql'" v-model:value="tableName" :label="t('tools.csv-to-data.texts.label-table-name')" label-placement="left" />

    <div mt-3 flex justify-center>
      <NButton :disabled="!((inputType === 'file' && fileInput) || csvContent)" @click="convertFile">
        {{ t('tools.csv-to-data.texts.tag-convert') }}
      </NButton>
    </div>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <c-card v-if="convertedData" :title="t('tools.csv-to-data.texts.title-converted-data')">
      <textarea-copyable :value="convertedData" :language="selectedFormat" />
    </c-card>
  </NCard>
</template>
