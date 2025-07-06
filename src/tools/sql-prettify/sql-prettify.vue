<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { type IndentStyle, type KeywordCase, format as formatSQL } from 'sql-formatter';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const keywordCase = useQueryParamOrStorage({ name: 'keywordCase', storageName: 'sql-prt:kw', defaultValue: 'upper' });
const dataTypeCase = useQueryParamOrStorage({ name: 'typeCase', storageName: 'sql-prt:dt', defaultValue: 'upper' });
const functionCase = useQueryParamOrStorage({ name: 'functionCase', storageName: 'sql-prt:ft', defaultValue: 'upper' });
const useTabs = useQueryParamOrStorage({ name: 'tabs', storageName: 'sql-prt:tab', defaultValue: false });
const language = useQueryParamOrStorage({ name: 'lang', storageName: 'sql-prt:l', defaultValue: 'sql' });
const indentStyle = useQueryParamOrStorage({ name: 'indent', storageName: 'sql-prt:ind', defaultValue: 'standard' });
const expressionWidth = useQueryParamOrStorage({ name: 'exprWidth', storageName: 'sql-prt:w', defaultValue: 50 });

const inputElement = ref<HTMLElement>();

const caseOptions = [
  { label: t('tools.sql-prettify.texts.label-uppercase'), value: 'upper' },
  { label: t('tools.sql-prettify.texts.label-lowercase'), value: 'lower' },
  { label: t('tools.sql-prettify.texts.label-preserve'), value: 'preserve' },
];

const rawSQL = ref('select field1,field2,field3 from my_table where my_condition;');
const prettySQL = computed(() => {
  try {
    return ({
      prettyQuery: formatSQL(rawSQL.value, {
        keywordCase: keywordCase.value as KeywordCase,
        dataTypeCase: dataTypeCase.value as KeywordCase,
        functionCase: functionCase.value as KeywordCase,
        useTabs: useTabs.value,
        language: language.value as never,
        indentStyle: indentStyle.value as IndentStyle,
        expressionWidth: expressionWidth.value,
      }),
      error: '',
    });
  }
  catch (e: any) {
    return { prettyQuery: rawSQL.value, error: e.toString() };
  }
});

const sqlDialects = [
  { value: 'sql', label: t('tools.sql-prettify.texts.label-standard-sql') },
  { value: 'bigquery', label: t('tools.sql-prettify.texts.label-gcp-bigquery') },
  { value: 'db2', label: t('tools.sql-prettify.texts.label-ibm-db2') },
  { value: 'db2i', label: t('tools.sql-prettify.texts.label-ibm-db2i-experimental') },
  { value: 'hive', label: t('tools.sql-prettify.texts.label-apache-hive') },
  { value: 'mariadb', label: t('tools.sql-prettify.texts.label-mariadb') },
  { value: 'mysql', label: t('tools.sql-prettify.texts.label-mysql') },
  { value: 'tidb', label: t('tools.sql-prettify.texts.label-tidb') },
  { value: 'n1ql', label: t('tools.sql-prettify.texts.label-couchbase-n1ql') },
  { value: 'plsql', label: t('tools.sql-prettify.texts.label-oracle-pl-sql') },
  { value: 'postgresql', label: t('tools.sql-prettify.texts.label-postgresql') },
  { value: 'redshift', label: t('tools.sql-prettify.texts.label-amazon-redshift') },
  { value: 'singlestoredb', label: t('tools.sql-prettify.texts.label-singlestoredb') },
  { value: 'snowflake', label: t('tools.sql-prettify.texts.label-snowflake') },
  { value: 'spark', label: t('tools.sql-prettify.texts.label-spark') },
  { value: 'sqlite', label: t('tools.sql-prettify.texts.label-sqlite') },
  { value: 'transactsql', label: t('tools.sql-prettify.texts.label-sql-server-transact-sql') },
  { value: 'trino', label: t('tools.sql-prettify.texts.label-trino-presto') },
];
</script>

<template>
  <div style="flex: 0 0 100%">
    <n-space justify="center" mb-3>
      <c-select
        v-model:value="language"
        flex-1
        :label="t('tools.sql-prettify.texts.label-dialect')"
        :options="sqlDialects"
      />
      <c-select
        v-model:value="keywordCase" :label="t('tools.sql-prettify.texts.label-keyword-case')"
        flex-1
        :options="caseOptions"
      />
      <c-select
        v-model:value="dataTypeCase" :label="t('tools.sql-prettify.texts.label-datatype-case')"
        flex-1
        :options="caseOptions"
      />
      <c-select
        v-model:value="functionCase" :label="t('tools.sql-prettify.texts.label-function-case')"
        flex-1
        :options="caseOptions"
      />
      <c-select
        v-model:value="indentStyle" :label="t('tools.sql-prettify.texts.label-indent-style')"
        flex-1
        :options="[
          { label: t('tools.sql-prettify.texts.label-standard'), value: 'standard' },
          { label: t('tools.sql-prettify.texts.label-tabular-left'), value: 'tabularLeft' },
          { label: t('tools.sql-prettify.texts.label-tabular-right'), value: 'tabularRight' },
        ]"
      />
    </n-space>

    <n-space justify="center">
      <n-form-item :label="t('tools.sql-prettify.texts.label-use-tabs')" label-placement="left">
        <n-checkbox v-model:checked="useTabs" mr-2 />
      </n-form-item>
      <n-form-item :label="t('tools.sql-prettify.texts.label-expressions-width')" label-placement="left">
        <n-input-number v-model:value="expressionWidth" :min="0" size="small" />
      </n-form-item>
    </n-space>
  </div>

  <n-form-item :label="t('tools.sql-prettify.texts.label-your-sql-query')">
    <c-input-text
      ref="inputElement"
      v-model:value="rawSQL"
      :placeholder="t('tools.sql-prettify.texts.placeholder-put-your-sql-query-here')"
      rows="20"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      monospace
    />
  </n-form-item>

  <n-form-item v-if="!prettySQL.error" :label="t('tools.sql-prettify.texts.label-prettify-version-of-your-query')">
    <TextareaCopyable :value="prettySQL.prettyQuery" language="sql" :follow-height-of="inputElement" />
  </n-form-item>

  <c-alert v-if="prettySQL.error" :title="t('tools.sql-prettify.texts.title-parsing-error')">
    {{ prettySQL.error }}
  </c-alert>
</template>

<style lang="less" scoped>
.result-card {
  position: relative;
  .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
