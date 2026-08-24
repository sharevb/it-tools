<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import * as XLSX from 'xlsx';
import TurndownService from 'turndown';
import { JsonLayout, MarkdownTable2Json } from 'mdt2json';
import { gfm as addGFM } from '@guyplusplus/turndown-plugin-gfm';

import { objectArrayToData } from '@/utils/objectarray.export';
import type { ExportFormat } from '@/utils/objectarray.export';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const htmlContent = ref('');
const error = ref('');

const convertedData = ref<string>('');
const selectedFormat = useQueryParamOrStorage({ name: 'fmt', storageName: 'html-to-data:fmt', defaultValue: 'json' });
const tableName = useQueryParamOrStorage({ name: 'table', storageName: 'html-to-data:tbl', defaultValue: 'TableName' });
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
  { label: t('tools.csv-to-data.texts.label-xlsx'), value: 'xlsx' },
];

const turndownService = new TurndownService();

function escapeMarkdown(text: string) {
  return text
    .replace(/\\/g, '\\\\') // escape backslash first
    .replace(/([*_#>|`])/g, '\\$1') // escape common markdown symbols
    .replace(/([\[\]\(\)])/g, '\\$1') // escape brackets and parentheses
    .replace(/\|/g, '\\|'); // escape table pipes
}

turndownService.addRule('escapeText', {
  filter(node) {
    return node.nodeType === 3; // text nodes
  },
  replacement(content) {
    return escapeMarkdown(content);
  },
});

addGFM(turndownService);

async function convertContent() {
  const htmlContentValue = htmlContent.value;
  error.value = '';
  convertedData.value = '';
  try {
    const markdownContent = turndownService.turndown(htmlContentValue);
    const transpiler = new MarkdownTable2Json({ markdownString: markdownContent, layout: JsonLayout.AoS, minify: true });
    const output_markdown = transpiler.transform();
    if ([...output_markdown?.match(/```json/g) || []].length > 1) {
      throw new Error(t('tools.html-to-data.texts.error-multiple-json-blocks'));
    }
    const output_first_codeblock = output_markdown?.match(/```json\n(.*?)\n```/s)?.[1] || '[]';
    const data = JSON.parse(output_first_codeblock);
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
  <div>
    <c-input-text
      v-model:value="htmlContent"
      :label="t('tools.html-to-data.texts.label-paste-your-html-content')"
      :placeholder="t('tools.html-to-data.texts.placeholder-your-html')"
      multiline
      paste-html
      rows="8"
    />

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
      <NButton :disabled="!htmlContent" @click="convertContent">
        {{ t('tools.csv-to-data.texts.tag-convert') }}
      </NButton>
    </div>

    <c-alert v-if="error" mt-2>
      {{ error }}
    </c-alert>

    <c-card v-if="convertedData" :title="t('tools.csv-to-data.texts.title-converted-data')">
      <textarea-copyable :value="convertedData" :language="selectedFormat" :download-file-name="`output.${selectedFormat}`" />
    </c-card>
  </div>
</template>
