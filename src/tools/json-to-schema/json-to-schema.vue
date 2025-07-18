<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import GenerateSchema from 'generate-schema';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const formats = [
  { value: 'generic', label: t('tools.json-to-schema.texts.label-generic') },
  { value: 'json', label: t('tools.json-to-schema.texts.label-json-schema') },
  { value: 'mysql', label: t('tools.json-to-schema.texts.label-mysql-table-schema') },
  { value: 'mongoose', label: t('tools.json-to-schema.texts.label-mongoose-schema') },
  { value: 'bigquery', label: t('tools.json-to-schema.texts.label-google-bigquery-schema') },
  { value: 'clickhouse', label: t('tools.json-to-schema.texts.label-clickhouse-table-schema') },
];

const tableName = ref('TableName');
const format = useQueryParamOrStorage({ name: 'fmt', storageName: 'json-to-schema:fmt', defaultValue: 'json' });

function convertJsonToSchema(value: string) {
  const object = JSON5.parse(value);
  switch (format.value) {
    case 'json':
      return JSON.stringify(GenerateSchema.json(tableName.value, object), null, 2);
    case 'mysql':
      return GenerateSchema.mysql(tableName.value, object);
    case 'mongoose':
      return JSON.stringify(GenerateSchema.mongoose(object), null, 2);
    case 'bigquery':
      return JSON.stringify(GenerateSchema.bigquery(object), null, 2);
    case 'clickhouse':
      return JSON.stringify(GenerateSchema.clickhouse(tableName.value, object, 'theDateField'), null, 2);
    default:
      return JSON.stringify(GenerateSchema.generic(object), null, 2);
  }
}
const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertJsonToSchema(value), '');
const schemaLanguage = computed(() => {
  switch (format.value) {
    case 'mysql':
      return 'sql';
    case 'mongoose':
      return 'json';
    case 'bigquery':
      return 'json';
    case 'clickhouse':
      return 'json';
    default:
      return 'json';
  }
});

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-schema.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <div>
    <c-select
      v-model:value="format"
      :options="formats"
      :placeholder="t('tools.json-to-schema.texts.placeholder-target-schema-format')"
    />
    <c-input-text
      v-if="['clickhouse', 'json', 'mysql'].includes(format)"
      v-model:value="tableName"
      :label="t('tools.json-to-schema.texts.label-table-name')"
      :placeholder="t('tools.json-to-schema.texts.placeholder-table-name')"
      mb-2
    />
    <n-divider />

    <format-transformer
      :input-label="t('tools.json-to-schema.texts.input-label-your-json')"
      :input-placeholder="t('tools.json-to-schema.texts.input-placeholder-paste-your-json-here')"
      :output-label="t('tools.json-to-schema.texts.output-label-your-schema')"
      :output-language="schemaLanguage"
      :input-validation-rules="rules"
      :transformer="transformer"
    />
  </div>
</template>
