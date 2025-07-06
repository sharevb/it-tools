<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import _ from 'lodash';

const { t } = useI18n();

const sqlQuery = ref(`select field1,field2,field3 
from my_table 
where my_condition = 'A  Z E';`);
const minifiedQuery = computed(() => {
  const quotedStrings: string[] = [];
  const queryWithoutQuotes = sqlQuery.value.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, (match) => {
    quotedStrings.push(match);
    return `__QUOTE_PLACEHOLDER_${quotedStrings.length - 1}__`;
  });

  let minified = _.trim(queryWithoutQuotes.replace(/\s+/g, ' '));

  quotedStrings.forEach((quote, index) => {
    minified = minified.replace(`__QUOTE_PLACEHOLDER_${index}__`, quote);
  });

  return minified;
});
</script>

<template>
  <c-card :title="t('tools.sql-minifier.texts.title-sql-minifier')">
    <c-input-text v-model:value="sqlQuery" :label="t('tools.sql-minifier.texts.label-sql-query')" multiline mb-1 rows="10" :placeholder="t('tools.sql-minifier.texts.placeholder-enter-sql-query')" />

    <c-card :title="t('tools.sql-minifier.texts.title-minified-sql-query')">
      <textarea-copyable :value="minifiedQuery" language="sql" />
    </c-card>
  </c-card>
</template>
