<script setup>
import { ref } from 'vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const query = ref('');
const language = useQueryParamOrStorage({ name: 'lang', storageName: 'wiktionary:l', defaultValue: 'en' });

// Extend this list as needed
const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Italian', value: 'it' },
  { label: 'Russian', value: 'ru' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Arabic', value: 'ar' },
];

const iframeUrl = ref('');
function openSearch() {
  const encoded = encodeURIComponent(query.value.trim());
  iframeUrl.value = `https://${language.value}.wiktionary.org/wiki/Special:Search?search=${encoded}`;
}
</script>

<template>
  <div>
    <n-form-item label="" label-placement="left">
      <n-input
        v-model:value="query"
        placeholder="Enter a word…"
        clearable
        mr-1
      />

      <n-select
        v-model:value="language"
        :options="languageOptions"
        placeholder="Select a language"
        filterable
      />
    </n-form-item>

    <n-space justify="center">
      <n-button
        type="primary"
        :disabled="!query || !language"
        @click="openSearch"
      >
        Search on Wiktionary
      </n-button>
    </n-space>

    <n-divider />

    <div style="height: 70vh; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
      <iframe
        v-if="iframeUrl"
        :src="iframeUrl"
        style="width: 100%; height: 100%; border: none;"
      />
      <div v-else style="padding: 1rem; text-align: center; color: #888;">
        Enter a word and select a language to load Wiktionary
      </div>
    </div>
  </div>
</template>
