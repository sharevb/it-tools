<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { escapeForLanguage, languages } from '@/utils/ascii-lang-utils';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const rawInput = ref('Hello "every"\n A\'');
const language = useQueryParamOrStorage({ name: 'lang', storageName: 'string-escaper:l', defaultValue: 'raw' });
const single_linize = useQueryParamOrStorage({ name: 'singleline', storageName: 'string-escaper:sl', defaultValue: false });
const languagesOptions = languages.map(lang => ({ value: lang.id, label: lang.name }));

const stringOutput = computed(() => escapeForLanguage(
  rawInput.value, language.value,
  { single_linize: single_linize.value }));
</script>

<template>
  <c-card :title="t('tools.string-escaper.texts.title-string-escaper')">
    <c-input-text
      v-model:value="rawInput"
      :label="t('tools.string-escaper.texts.label-your-text')"
      :placeholder="t('tools.string-escaper.texts.placeholder-your-raw-text-to-escape')"
      raw-text
      multiline
      rows="4"
      mb-2
    />
    <c-select v-model:value="language" :label="t('tools.string-escaper.texts.label-target-language')" :options="languagesOptions" searchable mb-2 />
    <n-space justify="center">
      <n-checkbox v-model:checked="single_linize">
        {{ t('tools.string-escaper.texts.tag-single-linize') }}
      </n-checkbox>
    </n-space>
  </c-card>
  <c-card :title="t('tools.string-escaper.texts.title-your-escaped-string-in-target-language')">
    <TextareaCopyable
      :value="stringOutput"
    />
  </c-card>
</template>
