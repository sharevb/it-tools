<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import { NDataTable, NIcon, NSpin, NSwitch, NTag, NText } from 'naive-ui';
import { Copy } from '@vicons/tabler';

// import {
//   IconCopy,
// } from '@tabler/icons-vue';
import type { ModelData } from './fetcher';
import { capitalizeFirstLetter, fetchModels, formatContextSize, formatPrice } from './fetcher';
import { useCopy } from '@/composable/copy';

// Components
import CCard from '@/ui/c-card/c-card.vue';
import CInputText from '@/ui/c-input-text/c-input-text.vue';
import CSelect from '@/ui/c-select/c-select.vue';
import CButton from '@/ui/c-button/c-button.vue';

// State
const loading = ref(true);
const error = ref<string | null>(null);
const allModels = ref<ModelData[]>([]);
const searchQuery = ref('');
const selectedProvider = ref<string | null>(null);
const showFreeModels = ref(false);

// Fetch data
async function fetchData() {
  loading.value = true;
  error.value = null;

  try {
    allModels.value = await fetchModels();
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Error fetching models:', err);
  }
  finally {
    loading.value = false;
  }
}

// Computed properties
const providers = computed(() => {
  if (!allModels.value || allModels.value.length === 0) {
    return [];
  }
  const uniqueProviders = new Set(allModels.value.map(model => model.provider));
  return Array.from(uniqueProviders).sort();
});

const providerOptions = computed(() => {
  if (!providers.value || providers.value.length === 0) {
    return [];
  }
  return providers.value.map(provider => ({
    label: provider,
    value: provider,
  }));
});

const filteredModels = computed(() => {
  return allModels.value.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.value.toLowerCase())
                          || model.id.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesProvider = !selectedProvider.value || model.provider === selectedProvider.value;
    const isFree
      = model.name.includes('(free)')
      || (Number.parseFloat(model.inputCost.replace('$', '')) === 0
      && Number.parseFloat(model.outputCost.replace('$', '')) === 0);

    return matchesSearch && matchesProvider && (!showFreeModels.value || isFree);
  });
});

// Table columns
const columns = computed(() => [
  {
    title: 'Model Name',
    key: 'name',
    sorter: (rowA: ModelData, rowB: ModelData) => rowA.name.localeCompare(rowB.name),
    render: (row: ModelData) => {
      const { copy } = useCopy({ createToast: false });

      return h('div', { class: 'flex items-center gap-2' }, [
        h(
          'a',
          {
            href: row.url,
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'text-blue-500 hover:underline',
          },
          row.name,
        ),
        h(
          'button',
          {
            class: 'text-gray-500 hover:text-gray-700 cursor-pointer bg-transparent border-none p-0',
            onClick: (e: Event) => {
              e.preventDefault();
              copy(row.id);
            },
            title: 'Copy model ID',
          },
          h(Copy, { component: Copy, style: { width: '16px', height: '16px' } }),
        ),
      ]);
    },
  },
  {
    title: 'Provider',
    key: 'provider',
    sorter: (rowA: ModelData, rowB: ModelData) => rowA.provider.localeCompare(rowB.provider),
  },
  {
    title: 'Context Length',
    key: 'contextWindow',
    sorter: (rowA: ModelData, rowB: ModelData) => rowA.contextWindow - rowB.contextWindow,
    render: (row: ModelData) => {
      return h(NText, {}, formatContextSize(row.contextWindow));
    },
  },
  {
    title: 'Max Output Token',
    key: 'maxOutputToken',
    sorter: (rowA: ModelData, rowB: ModelData) => (rowA.maxOutputToken || 0) - (rowB.maxOutputToken || 0),
    render: (row: ModelData) => {
      return h(NText, {}, row.maxOutputToken ? formatContextSize(row.maxOutputToken) : 'N/A');
    },
  },
  {
    title: 'Input Cost',
    key: 'inputCost',
    sorter: (rowA: ModelData, rowB: ModelData) => {
      const costA = Number.parseFloat(rowA.inputCost.replace(/[^\d.-]/g, ''));
      const costB = Number.parseFloat(rowB.inputCost.replace(/[^\d.-]/g, ''));
      return costA - costB;
    },
    render: (row: ModelData) => {
      return h(NText, {}, row.inputCost);
    },
  },
  {
    title: 'Output Cost',
    key: 'outputCost',
    sorter: (rowA: ModelData, rowB: ModelData) => {
      const costA = Number.parseFloat(rowA.outputCost.replace(/[^\d.-]/g, ''));
      const costB = Number.parseFloat(rowB.outputCost.replace(/[^\d.-]/g, ''));
      return costA - costB;
    },
    render: (row: ModelData) => {
      return h(NText, {}, row.outputCost);
    },
  },
  {
    title: 'Modalities',
    key: 'modalities',
    sorter: (rowA: ModelData, rowB: ModelData) => rowA.modalities.join(', ').localeCompare(rowB.modalities.join(', ')),
    render: (row: ModelData) => {
      return h(NText, {}, row.modalities.join(', '));
    },
  },
  {
    title: 'Features',
    key: 'features',
    sorter: (rowA: ModelData, rowB: ModelData) => rowA.features.join(', ').localeCompare(rowB.features.join(', ')),
    render: (row: ModelData) => {
      return h('div', { class: 'flex flex-wrap gap-1' },
        row.features.map(feature =>
          h(NTag, { type: 'info', size: 'small', class: 'mr-1 mb-1' }, { default: () => feature }),
        ),
      );
    },
  },
]);

// Pagination
const pagination = computed(() => ({
  pageSize: 20,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  itemCount: filteredModels.value.length,
  onUpdatePage: (page: number) => {
    // Handle page updates if needed
  },
  onUpdatePageSize: (pageSize: number) => {
    // Handle page size updates if needed
  },
}));

// Lifecycle
onMounted(() => {
  fetchData();
});
</script>

<template>
  <CCard>
    <div class="min-h-[400px] flex flex-col gap-4">
      <!-- Search and Filter Controls -->
      <div class="flex flex-col gap-4 sm:flex-row">
        <CInputText
          v-model:value="searchQuery"
          placeholder="Search by model name..."
          class="flex-1"
        />
        <div class="w-full flex gap-2 sm:w-auto">
          <div class="mr-4 flex items-center">
            <NSwitch
              v-model:value="showFreeModels"
            />
            <span class="ml-2 text-sm">Show Free Models</span>
          </div>
          <CSelect
            v-if="!loading || providerOptions.length > 0"
            :key="providerOptions.length"
            v-model:value="selectedProvider"
            :options="providerOptions"
            :placeholder="providerOptions.length === 0 ? (loading ? 'Loading providers...' : 'No providers available') : 'Filter by provider...'"
            class="flex-1 sm:w-64"
            :clearable="true"
          />
          <div v-else-if="loading" class="w-full sm:w-64">
            <div class="h-10 flex items-center border border-gray-300 rounded-md bg-white px-3 text-gray-500">
              Loading providers...
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-8">
        <NSpin size="large" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-8 text-center text-red-500">
        <div class="mb-4 text-red-500">
          <span class="mr-2">⚠️</span>
          Error loading models: {{ error }}
        </div>
        <CButton @click="fetchData">
          Retry
        </CButton>
      </div>

      <!-- Models Table -->
      <div v-else class="overflow-x-auto">
        <NDataTable
          :columns="columns"
          :data="filteredModels"
          :pagination="pagination"
          :loading="loading"
          :scroll-x="1200"
          class="w-full"
          size="small"
        />
      </div>
    </div>
  </CCard>
</template>

<style lang="less" scoped>
:deep(.n-data-table-th) {
  background-color: var(--n-td-color) !important;
}
</style>
