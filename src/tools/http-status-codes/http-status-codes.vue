<script setup lang="ts">
import {
  IconCircleArrowUpRight,
  IconCircleCheck,
  IconDatabaseExclamation,
  IconDeviceDesktopExclamation,
  IconExternalLink,
  IconInfoCircle,
} from '@tabler/icons-vue';
import { codesByCategories } from './http-status-codes.constants';
import { useFlexSearch } from '@/composable/flexSearch';

const search = ref('');

const { searchResult } = useFlexSearch({
  search,
  data: codesByCategories.flatMap(({ codes, category }) => codes.map(code => ({ ...code, category }))),
  options: {
    keys: [{ name: 'code', weight: 3 }, { name: 'name', weight: 2 }, 'description', 'category'],
  },
});

const codesByCategoryFiltered = computed(() => {
  if (!search.value) {
    return codesByCategories;
  }

  return [{ category: 'Search results', codes: searchResult.value }];
});

function getCategoryIcon(category: string) {
  const categoryLower = category.toLowerCase();

  if (categoryLower.includes('informational') || categoryLower.includes('1xx')) {
    return IconInfoCircle;
  }
  if (categoryLower.includes('success') || categoryLower.includes('2xx')) {
    return IconCircleCheck;
  }
  if (categoryLower.includes('redirection') || categoryLower.includes('3xx')) {
    return IconCircleArrowUpRight;
  }
  if (categoryLower.includes('client error') || categoryLower.includes('4xx')) {
    return IconDeviceDesktopExclamation;
  }
  if (categoryLower.includes('server error') || categoryLower.includes('5xx')) {
    return IconDatabaseExclamation;
  }

  // Default icon for search results or unknown categories
  return IconInfoCircle;
}

function openMdnDocs(code: string) {
  window.open(`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${code}`, '_blank', 'noopener,noreferrer');
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="search"
      placeholder="Search http status..."
      autofocus raw-text mb-10
    />

    <div v-for="{ codes, category } of codesByCategoryFiltered" :key="category" mb-8>
      <div mb-2 flex items-center gap-2 text-xl font-bold>
        <n-icon :component="getCategoryIcon(category)" size="26" />
        {{ category }}
      </div>

      <c-card v-for="{ code, description, name, type } of codes" :key="code" mb-2>
        <div flex items-center gap-2 text-lg font-bold>
          {{ code }} {{ name }}
          <div
            class="flex cursor-pointer items-center justify-center rounded text-gray-500 transition-colors hover:text-blue-600"
            title="View MDN documentation"
            @click="openMdnDocs(String(code))"
          >
            <n-icon :component="IconExternalLink" size="18" />
          </div>
        </div>
        <div op-70>
          {{ description }} {{ type !== 'HTTP' ? `For ${type}.` : '' }}
        </div>
      </c-card>
    </div>
  </div>
</template>
