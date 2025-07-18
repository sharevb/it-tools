<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import { type Unit, convertMany } from 'convert';
import allUnits from './allunits.json';

const { t } = useI18n();

const allUnitsSorted = _.uniq(allUnits).sort();

const inputExpression = ref('');
const outputUnit = ref('');
const result = computed(() => {
  try {
    const best = convertMany(inputExpression.value).to('best');
    try {
      return {
        best,
        selected: outputUnit.value
          ? convertMany(inputExpression.value).to(outputUnit.value as Unit)
          : '',
      };
    }
    catch (e: any) {
      return {
        best,
        error: e.toString(),
      };
    }
  }
  catch (e: any) {
    return {
      error: e.toString(),
    };
  }
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputExpression"
      :label="t('tools.many-units-converter.texts.label-units-expression')"
      :placeholder="t('tools.many-units-converter.texts.placeholder-please-enter-an-unit-expression-ie-1d-2m')"
      mb-2
    />
    <c-select
      v-model:value="outputUnit"
      label-position="left"
      label-width="100px"
      :label="t('tools.many-units-converter.texts.label-target-unit')"
      :options="allUnitsSorted"
      :placeholder="t('tools.many-units-converter.texts.placeholder-select-the-target-unit')"
      searchable
    />

    <n-divider />

    <c-card v-if="result.best" :title="t('tools.many-units-converter.texts.title-result')" mb-2>
      <input-copyable :label="t('tools.many-units-converter.texts.label-best-target-unit')" :value="result.best" mb-1 />
      <input-copyable v-if="result.selected" :label="`Selected Target Unit (${outputUnit})`" :value="result.selected" />
    </c-card>
    <c-alert v-if="result.error && inputExpression">
      {{ result.error }}
    </c-alert>
  </div>
</template>
