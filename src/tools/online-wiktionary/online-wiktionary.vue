<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const query = ref('');
const language = useQueryParamOrStorage({ name: 'lang', storageName: 'wiktionary:l', defaultValue: 'en' });

// Extend this list as needed
const languageOptions = [
  { label: t('tools.online-wiktionary.texts.label-english'), value: 'en' },
  { label: t('tools.online-wiktionary.texts.label-french'), value: 'fr' },
  { label: t('tools.online-wiktionary.texts.label-german'), value: 'de' },
  { label: t('tools.online-wiktionary.texts.label-spanish'), value: 'es' },
  { label: t('tools.online-wiktionary.texts.label-italian'), value: 'it' },
  { label: t('tools.online-wiktionary.texts.label-russian'), value: 'ru' },
  { label: t('tools.online-wiktionary.texts.label-chinese'), value: 'zh' },
  { label: t('tools.online-wiktionary.texts.label-japanese'), value: 'ja' },
  { label: t('tools.online-wiktionary.texts.label-arabic'), value: 'ar' },
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
        :placeholder="t('tools.online-wiktionary.texts.placeholder-enter-a-word')"
        clearable
        mr-1
      />

      <n-select
        v-model:value="language"
        :options="languageOptions"
        :placeholder="t('tools.online-wiktionary.texts.placeholder-select-a-language')"
        filterable
      />
    </n-form-item>

    <n-space justify="center">
      <n-button
        type="primary"
        :disabled="!query || !language"
        @click="openSearch"
      >
        {{ t('tools.online-wiktionary.texts.tag-search-on-wiktionary') }}
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
        {{ t('tools.online-wiktionary.texts.tag-enter-a-word-and-select-a-language-to-load-wiktionary') }}
      </div>
    </div>
  </div>
</template>
