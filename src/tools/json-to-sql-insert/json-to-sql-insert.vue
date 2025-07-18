<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { flatten } from 'flatten-anything';
import { objectArrayToData } from '@/utils/objectarray.export';
import type { UseValidationRule } from '@/composable/validation';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const defaultValue = `{
  a:"n",
  arr: [1, 2], 
  nested: {
    a:1,
    b:"2"
  }
}`;
const jsonInput = ref(defaultValue);
const tableName = ref<string>('TableName');

const sqlOutput = computed(() => {
  try {
    let arr = JSON.parseBigInt(jsonInput.value);
    if (!Array.isArray(arr)) {
      arr = [arr];
    }
    return objectArrayToData(arr.map((o: any) => flatten(o)), 'sql', { tableName: tableName.value });
  }
  catch (e: any) {
    return e.toString();
  }
});

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-sql-insert.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <c-card :title="t('tools.json-to-sql-insert.texts.title-json-to-sql-insert')">
    <c-input-text v-model:value="tableName" :label="t('tools.json-to-sql-insert.texts.label-table-name')" label-placement="left" mb-1 />
    <c-input-text
      v-model:value="jsonInput"
      multiline
      :placeholder="t('tools.json-to-sql-insert.texts.placeholder-put-your-json-string-here')"
      rows="20"
      :label="t('tools.json-to-sql-insert.texts.label-json')"
      :validation-rules="rules"
      raw-text
    />
  </c-card>
  <c-card :title="t('tools.json-to-sql-insert.texts.title-your-sql-insert-code')">
    <TextareaCopyable
      :value="sqlOutput"
      language="sql"
    />
  </c-card>
</template>
