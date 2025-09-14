<script setup lang="ts">
import _ from 'lodash';
import { useHead } from '@vueuse/head';
import { useMessage } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { useToolStore } from '@/tools/tools.store';

const { t } = useI18n();

const toolStore = useToolStore();

const desc = 'Collection of handy online tools for developers, with great UX. IT Tools is a free and open-source collection of handy online tools for developers & people working in IT.';
const title = 'About - IT Tools';
useHead({
  title,
  meta: [
    {
      itemprop: 'name',
      content: title,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'twitter:title',
      content: title,
    },
    {
      name: 'description',
      content: desc,
    },
    {
      itemprop: 'description',
      content: desc,
    },
    {
      property: 'og:description',
      content: desc,
    },
    {
      property: 'twitter:description',
      content: desc,
    },
  ],
});

const orderedTools = computed(() => _.orderBy(toolStore.tools, ['category', 'name'], ['asc', 'asc']));
const { favoriteToolsName } = storeToRefs(toolStore);

const message = useMessage();
const importFavoritesJson = ref('');
function importFavorites() {
  try {
    favoriteToolsName.value = JSON.parse(importFavoritesJson.value);
    message.success(t('about.favorites-imported-successfully'));
  }
  catch (e: any) {
    message.error(t('about.error-importing-favorites-e', [e]));
  }
}
const favoritesJson = computed(() => JSON.stringify(favoriteToolsName.value));
</script>

<template>
  <c-markdown :markdown="$t('about.content-fork')" mx-auto mt-50px />

  <n-card :title="$t('about.import-favorites')" mx-auto mt-50px>
    <c-input-text
      v-model:value="importFavoritesJson"
      :placeholder="$t('about.put-your-favorites-json-array-here')"
      multiline
      monospace
      mb-2
    />
    <c-button @click="importFavorites">
      {{ $t('about.import-button') }}
    </c-button>
  </n-card>

  <n-card :title="$t('about.export-favorites')" mx-auto mt-50px>
    <textarea-copyable
      v-model:value="favoritesJson"
    />
  </n-card>

  <n-card :title="$t('about.alltools-title', { toolsCount: toolStore.tools.length })" mx-auto mt-50px>
    <n-table>
      <thead>
        <tr>
          <th>
            {{ $t('about.tools.category') }}
          </th>
          <th>
            {{ $t('about.tools.name') }}
          </th>
          <th>
            {{ $t('about.tools.desc') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tool, ix) in orderedTools" :key="ix">
          <td>
            {{ tool.category }}
          </td>
          <td>
            <router-link :to="tool.path" class="decoration-none" target="_blank">
              {{ tool.name }}
            </router-link>
          </td>
          <td>
            {{ tool.description }}
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-card>
</template>
