<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import { type Unit, convertMany } from 'convert';
import allUnits from './allunits.json';
import { useQueryParam } from '@/composable/queryParams';
import { useToolStore } from '@/tools/tools.store';

const { t } = useI18n();

const toolStore = useToolStore();

const unitsConversionTools = computed(() => _.orderBy(
  _.filter(toolStore.tools, t => t.keywords?.includes('units')),
  'name', 'asc'));

const allUnitsSorted = _.uniq(allUnits).sort();

const inputExpression = useQueryParam({ tool: 'many-units-conv', name: 'expr', defaultValue: '' });
const outputUnit = useQueryParam({ tool: 'many-units-conv', name: 'unit', defaultValue: '' });
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
      <input-copyable v-if="result.selected" :label="$t('tools.many-units-converter.texts.label-selected-target-unit-outputunit', [outputUnit])" :value="result.selected" />
    </c-card>
    <c-alert v-if="result.error && inputExpression" mb-2>
      {{ result.error }}
    </c-alert>

    <n-card :title="$t('tools.many-units-converter.texts.title-other-units-conversion-tools')" mx-auto>
      <n-table>
        <thead>
          <tr>
            <th>
              {{ $t('about.tools.name') }}
            </th>
            <th>
              {{ $t('about.tools.desc') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tool, ix) in unitsConversionTools" :key="ix">
            <td>
              <router-link :to="tool.path" class="decoration-none" target="_blank">
                {{ tool.name }}
              </router-link>
            </td>
            <td>
              {{ tool.description }}
              <br>
              -&gt; {{ tool.keywords?.join(', ') }}
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>
