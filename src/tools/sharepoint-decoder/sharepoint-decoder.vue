<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { decodeSharePointsURL } from './sharepoint-decoder.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const inputSharePointUrl = useQueryParam({ tool: 'sharepoint-decoder', name: 'url', defaultValue: '' });
const outputDecodedUrl = computed(() => {
  try {
    return decodeSharePointsURL(inputSharePointUrl.value);
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputSharePointUrl"
      raw-text
      :placeholder="t('tools.sharepoint-decoder.texts.placeholder-your-input-sharepoint-url')"
      autofocus
      :label="t('tools.sharepoint-decoder.texts.label-your-input-sharepoint-url')"
    />

    <n-divider />

    <n-form-item :label="t('tools.sharepoint-decoder.texts.label-output-decoded-url')">
      <TextareaCopyable :value="outputDecodedUrl" :word-wrap="true" />
    </n-form-item>
  </div>
</template>
