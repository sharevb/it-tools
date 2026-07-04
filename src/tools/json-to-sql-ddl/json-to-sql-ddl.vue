<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import GenerateSchema from 'generate-schema';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const tableName = useQueryParamOrStorage({ name: 'table', storageName: 'json-to-sqlddl:tbl', defaultValue: 'TableName' });

function convertJsonToDDL(value: string) {
  const object = JSON5.parse(value);
  return GenerateSchema.mysql(tableName.value, object);
}
const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertJsonToDDL(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-sql-ddl.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <div>
    <c-input-text
      v-model:value="tableName"
      :label="t('tools.json-to-sql-ddl.texts.label-table-name')"
      :placeholder="t('tools.json-to-sql-ddl.texts.placeholder-table-name')"
      mb-2
    />
    <n-divider />

    <format-transformer
      :input-label="t('tools.json-to-sql-ddl.texts.input-label-your-json')"
      :input-placeholder="t('tools.json-to-sql-ddl.texts.input-placeholder-paste-your-json-here')"
      :output-label="t('tools.json-to-sql-ddl.texts.output-label-your-sql-ddl')"
      output-language="sql"
      :input-validation-rules="rules"
      :transformer="transformer"
    />
  </div>
</template>
