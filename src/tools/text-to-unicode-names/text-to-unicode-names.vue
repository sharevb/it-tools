<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { convertTextToUnicodeNames } from './text-to-unicode-names.service';

const { t } = useI18n();

const inputText = ref('');
const unicodeNamesFromText = computed(() => convertTextToUnicodeNames(inputText.value, { separator: '\n' }));
</script>

<template>
  <c-card :title="t('tools.text-to-unicode-names.texts.title-text-to-unicode-names')">
    <c-input-text
      v-model:value="inputText"
      multiline :placeholder="t('tools.text-to-unicode-names.texts.placeholder-e-g-hello-world')"
      :label="t('tools.text-to-unicode-names.texts.label-enter-text-to-convert-to-unicode-names')"
      autosize autofocus raw-text
    />
    <textarea-copyable
      v-model:value="unicodeNamesFromText"
      word-wrap
      :label="t('tools.text-to-unicode-names.texts.label-unicode-names-from-your-text')" multiline raw-text readonly mt-2
      :placeholder="t('tools.text-to-unicode-names.texts.placeholder-the-unicode-names-representation-of-your-text-will-be-here')"
    />
  </c-card>
</template>
