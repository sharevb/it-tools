<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import iesData from './ies-lighting-data.json';
import useDebouncedRef from '@/composable/debouncedref';
import { useFlexSearch } from '@/composable/flexSearch';

const { t } = useI18n();

const data = iesData;
const searchQuery = useDebouncedRef('', 250);

const { searchResult } = useFlexSearch({
  search: searchQuery,
  data,
  options: {
    keys: ['industryType', 'industryApplication', 'footCandlesRange', 'recommendedLighting'],
    filterEmpty: false,
  },
});
</script>

<template>
  <div mx-auto max-w-2400px important:flex-1>
    <div flex items-center gap-3>
      <c-input-text
        v-model:value="searchQuery"
        :placeholder="t('tools.ies-lighting-guidelines.texts.placeholder-search-ies-recommendation-by-industry-or-application')"
        mx-auto max-w-600px
      >
        <template #prefix>
          <icon-mdi-search mr-6px color-black op-70 dark:color-white />
        </template>
      </c-input-text>
    </div>

    <n-p style="text-align: center">
      {{ t('tools.ies-lighting-guidelines.texts.tag-individual-applications-will-determine-exact-foot-candle-levels-please-refer-to-the') }}<n-a href="https://www.ies.org/standards/lighting-library/" target="_blank">
        {{ t('tools.ies-lighting-guidelines.texts.tag-ies-lighting-handbook') }}
      </n-a>{{ t('tools.ies-lighting-guidelines.texts.tag-for-a-more-detailed-evaluation') }}
    </n-p>

    <div>
      <div
        v-if="searchResult.length === 0"

        mt-4 text-center text-20px font-bold
      >
        {{ t('tools.ies-lighting-guidelines.texts.tag-no-results') }}
      </div>

      <div v-else>
        <div mt-4 text-20px font-bold>
          {{ t('tools.ies-lighting-guidelines.texts.tag-search-result') }}
        </div>

        <n-table>
          <thead>
            <th>{{ t('tools.ies-lighting-guidelines.texts.tag-industry') }}</th>
            <th>{{ t('tools.ies-lighting-guidelines.texts.tag-application') }}</th>
            <th>{{ t('tools.ies-lighting-guidelines.texts.tag-foot-candles') }}</th>
            <th>{{ t('tools.ies-lighting-guidelines.texts.tag-lighting-type') }}</th>
          </thead>
          <tbody>
            <tr v-for="(result, ix) in searchResult" :key="ix">
              <td>
                <input-copyable :readonly="true" :value="result.industryType" />
              </td>
              <td>
                <input-copyable :readonly="true" :value="result.industryApplication" />
              </td>
              <td>
                <input-copyable :readonly="true" :value="result.footCandlesRange" />
              </td>
              <td>
                <input-copyable :readonly="true" :value="result.recommendedLighting" />
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </div>
</template>
