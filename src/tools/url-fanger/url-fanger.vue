<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { defang, refang } from 'fanger';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const textInput = ref('');
const defangOutput = computed(() => defang(textInput.value));

const fangedInput = ref('');
const refangOutput = computed(() => refang(fangedInput.value));
</script>

<template>
  <c-card :title="t('tools.url-fanger.texts.title-refang-string')">
    <c-input-text
      v-model:value="fangedInput"
      multiline
      :placeholder="t('tools.url-fanger.texts.placeholder-put-your-string-here')"
      rows="5"
      :label="t('tools.url-fanger.texts.label-string-to-refang')"
      raw-text
      mb-5
    />

    <TextareaCopyable
      :label="t('tools.url-fanger.texts.label-string-fanged')"
      :value="refangOutput"
      :placeholder="t('tools.url-fanger.texts.placeholder-the-refang-encoding-of-your-string-will-be-here')"
      mb-5
    />
  </c-card>

  <c-card :title="t('tools.url-fanger.texts.title-defang-string')">
    <c-input-text
      v-model:value="textInput"
      multiline
      :placeholder="t('tools.url-fanger.texts.placeholder-your-fanged-string')"
      rows="5"
      :label="t('tools.url-fanger.texts.label-fanged-string-to-decode')"
      mb-5
    />

    <TextareaCopyable
      v-model:value="defangOutput"
      :label="t('tools.url-fanger.texts.label-defanged-string')"
      :placeholder="t('tools.url-fanger.texts.placeholder-the-defanged-string-will-be-here')"
      mb-5
    />
  </c-card>
</template>
