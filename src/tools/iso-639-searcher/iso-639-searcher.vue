<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, nextTick, onUnmounted, ref } from 'vue';
import { all as allCodes } from 'langs';
import useDebouncedRef from '@/composable/debouncedref';
import { useFlexSearch } from '@/composable/flexSearch';

const { t } = useI18n();

const searchQuery = useDebouncedRef('', 250);
const langsSearchData = allCodes();
const limit = ref(20);
const { searchResult } = useFlexSearch({
  search: searchQuery,
  data: langsSearchData,
  options: {
    keys: [{ name: 'name', weight: 2 }, { name: '1', weight: 3 }, { name: '2T', weight: 2 }, { name: '2B', weight: 2 }, { name: '3', weight: 2 }, 'local'],
  },
  limit,
});

// Batch loading logic for search results
const RESULTS_PER_BATCH = 2; // Show 2 results per batch
const visibleResultsCount = ref(RESULTS_PER_BATCH); // Start with first batch
let loadingInterval: NodeJS.Timeout | null = null;

// Computed property for visible search results
const visibleSearchResults = computed(() => {
  return searchResult.value.slice(0, visibleResultsCount.value);
});

// Function to stop automated loading
function stopAutomatedLoading() {
  if (loadingInterval) {
    clearInterval(loadingInterval);
    loadingInterval = null;
  }
}

// Function to start automated loading
function startAutomatedLoading() {
  // Clear any existing interval
  if (loadingInterval) {
    clearInterval(loadingInterval);
  }

  // Reset visible count when starting new search
  visibleResultsCount.value = RESULTS_PER_BATCH;

  // Start loading batches every 150ms
  loadingInterval = setInterval(() => {
    if (visibleResultsCount.value < searchResult.value.length) {
      visibleResultsCount.value = Math.min(
        visibleResultsCount.value + RESULTS_PER_BATCH,
        searchResult.value.length,
      );
    }
    else {
      // Stop loading when all results are visible
      stopAutomatedLoading();
    }
  }, 150);
}

// Watch for changes in search results to restart batching
watch(searchResult, (newResults) => {
  if (newResults.length > 0) {
    nextTick(() => {
      startAutomatedLoading();
    });
  }
  else {
    stopAutomatedLoading();
  }
}, { immediate: true });

// Clean up on component unmount
onUnmounted(() => {
  stopAutomatedLoading();
});
</script>

<template>
  <div mx-auto max-w-2400px important:flex-1>
    <div mx-auto max-w-600px flex justify-center gap-3>
      <c-input-text v-model:value="searchQuery" :placeholder="t('tools.iso-639-searcher.texts.placeholder-search-iso-639-language-code-by-iso-1-iso-2t-2b-iso-3-name')">
        <template #prefix>
          <icon-mdi-search mr-6px color-black op-70 dark:color-white />
        </template>
      </c-input-text>
      <n-form-item :label="t('tools.iso-639-searcher.texts.label-max-results')" label-placement="left">
        <n-input-number-i18n v-model:value="limit" :min="1" />
      </n-form-item>
    </div>

    <div v-if="searchQuery.trim().length > 0">
      <div v-if="searchResult.length === 0" mt-4 text-20px font-bold>
        {{ t('tools.iso-639-searcher.texts.tag-no-results') }}
      </div>

      <div v-else>
        <div mt-4 text-20px font-bold>
          {{ t('tools.iso-639-searcher.texts.tag-search-results') }}
        </div>

        <n-table>
          <thead>
            <th>{{ t('tools.iso-639-searcher.texts.tag-iso-639-1') }}</th>
            <th>{{ t('tools.iso-639-searcher.texts.tag-iso-639-2t-2b') }}</th>
            <th>{{ t('tools.iso-639-searcher.texts.tag-iso-639-3') }}</th>
            <th>{{ t('tools.iso-639-searcher.texts.tag-english-and-local-name') }}</th>
          </thead>
          <tbody>
            <tr v-for="(result, ix) in visibleSearchResults" :key="ix">
              <td>
                <input-copyable :value="result[1]" :readonly="true" />
              </td>
              <td>
                <input-copyable label-position="left" :label="t('tools.iso-639-searcher.texts.label-2b')" :value="result['2B']" :readonly="true" mb-1 />
                <input-copyable label-position="left" :label="t('tools.iso-639-searcher.texts.label-2t')" :value="result['2T']" :readonly="true" />
              </td>
              <td>
                <input-copyable :value="result['3']" :readonly="true" />
              </td>
              <td>
                <input-copyable label-position="left" :label="t('tools.iso-639-searcher.texts.label-eng')" :value="result.name" :readonly="true" mb-1 />
                <input-copyable :value="result.local" :readonly="true" />
              </td>
            </tr>
          </tbody>
        </n-table>

        <!-- Loading indicator when more results are coming -->
        <div v-if="visibleResultsCount < searchResult.length" mt-6 text-center>
          <div text-14px op-70>
            {{ $t('tools.iso-639-searcher.texts.loading-more-results') }} ({{ visibleSearchResults.length }}/{{ searchResult.length }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
