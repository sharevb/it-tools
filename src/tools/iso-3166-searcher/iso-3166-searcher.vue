<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref } from 'vue';
import CountriesDB from 'countries-db';
import ISO6391 from 'iso-639-1';
import useDebouncedRef from '@/composable/debouncedref';
import { useFlexSearch } from '@/composable/flexSearch';

const searchQuery = useDebouncedRef('', 250);
const countriesSearchData = Object.values(CountriesDB.getAllCountries());
const limit = ref(20);
const { searchResult } = useFlexSearch({
  search: searchQuery,
  data: countriesSearchData,
  options: {
    keys: [{ name: 'name', weight: 2 }, { name: 'iso3', weight: 3 }, { name: 'iso2', weight: 2 }, 'officialName', 'domain', 'continentId', 'currencyCode', 'currencyName', 'phoneCode'],
  },
  limit,
});

function langToName(code: string) {
  const name = ISO6391.getName(code);
  if (!name) {
    return code;
  }
  return `${code} (${name})`;
}

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
      <c-input-text v-model:value="searchQuery" placeholder="Search Countries by name, iso2, iso3...">
        <template #prefix>
          <icon-mdi-search mr-6px color-black op-70 dark:color-white />
        </template>
      </c-input-text>
      <n-form-item label="Max results:" label-placement="left">
        <n-input-number v-model:value="limit" :min="1" />
      </n-form-item>
    </div>

    <div v-if="searchQuery.trim().length > 0">
      <div v-if="searchResult.length === 0" mt-4 text-20px font-bold>
        No results
      </div>

      <div v-else>
        <div mt-4 text-20px font-bold>
          Search result
        </div>

        <n-table>
          <thead>
            <th>Iso2/Iso3</th>
            <th>Name and Info</th>
          </thead>
          <tbody>
            <tr v-for="(result, ix) in visibleSearchResults" :key="ix">
              <td style="vertical-align: top">
                <input-copyable :value="result.iso2" :readonly="true" />
                <input-copyable :value="result.iso3" :readonly="true" />
              </td>
              <td>
                <input-copyable label-width="150px" label="Name" label-position="left" :value="result.name" :readonly="true" mb-1 />
                <input-copyable
                  label-width="150px"
                  label="Official Name"
                  label-position="left"
                  :value="result.officialName"
                  :readonly="true"
                  mb-1
                />
                <input-copyable label-width="150px" label="Domain" label-position="left" :value="result.domain" :readonly="true" mb-1 />
                <input-copyable
                  label-width="150px"
                  label="Emoji"
                  label-position="left"
                  :value="`${result.emoji}`"
                  :readonly="true"
                  mb-1
                />
                <input-copyable
                  label-width="150px"
                  label="ISO Num"
                  label-position="left"
                  :value="result.isoNumeric"
                  :readonly="true"
                  mb-1
                />
                <input-copyable
                  label-width="150px"
                  label="Continent"
                  label-position="left"
                  :value="result.continentId"
                  :readonly="true"
                  mb-1
                />
                <input-copyable
                  label-width="150px"
                  label="Elevation (m)"
                  label-position="left"
                  :value="result.elevation"
                  :readonly="true"
                  mb-1
                />
                <input-copyable
                  label-width="150px"
                  label="Population"
                  label-position="left"
                  :value="result.population"
                  :readonly="true"
                  mb-1
                />
                <input-copyable
                  label-width="150px"
                  label="Area (km²)"
                  label-position="left"
                  :value="result.areaSqKm"
                  :readonly="true"
                  mb-1
                />
                <input-copyable
                  label-width="150px"
                  label="Timezones"
                  label-position="left"
                  :value="result.timezones.join('\n')"
                  :readonly="true"
                  mb-1
                />
                <input-copyable
                  label-width="150px"
                  label="Currency"
                  label-position="left"
                  :value="`${result.currencyCode} / ${result.currencyName}`"
                  :readonly="true"
                  mb-1
                />
                <input-copyable
                  label-width="150px"
                  label="Postal Code"
                  label-position="left"
                  :value="`${result.postalCodeFormat} / ${result.postalCodeRegex}`"
                  :readonly="true"
                  mb-1
                />
                <input-copyable
                  label-width="150px"
                  label="Phone Code"
                  label-position="left"
                  :value="result.phoneCode"
                  :readonly="true"
                  mb-1
                />
                <input-copyable
                  label-width="150px"
                  label="Neighbor Countries"
                  label-position="left"
                  :value="
                    result.neighborCountryIds
                      .map((id) => CountriesDB.getCountry(id, 'name')?.toString() || id)
                      .join(', ')
                      || 'None'
                  "
                  :readonly="true"
                  mb-1
                />
                <input-copyable
                  label-width="150px"
                  label="Languages"
                  label-position="left"
                  :value="result.languages.map(langToName).join(', ')"
                  :readonly="true"
                  mb-1
                />
                <input-copyable
                  label-width="150px"
                  label="Locales"
                  label-position="left"
                  :value="result.locales.map(langToName).join(', ')"
                  :readonly="true"
                  mb-1
                />
                <!-- //NOSONAR --><n-a
                  :href="`https://www.openstreetmap.org/#map=5/${result.coordinates.latitude}/${result.coordinates.longitude}`"
                  target="_blank"
                >
                  &gt; See on OpenStreetMap
                </n-a>
              </td>
            </tr>
          </tbody>
        </n-table>

        <!-- Loading indicator when more results are coming -->
        <div v-if="visibleResultsCount < searchResult.length" mt-6 text-center>
          <div text-14px op-70>
            Loading more results... ({{ visibleSearchResults.length }}/{{ searchResult.length }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
