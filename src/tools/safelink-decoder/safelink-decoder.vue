<script setup lang="ts">
import { decodeSafeLinksURL } from './safelink-decoder.service';
import { useQueryParam } from '@/composable/queryParams';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();
const inputSafeLinkUrl = useQueryParam({ tool: 'safelink-decoder', name: 'url', defaultValue: '' });
const outputDecodedUrl = computed(() => {
  try {
    return decodeSafeLinksURL(inputSafeLinkUrl.value);
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputSafeLinkUrl"
      raw-text
      :placeholder="t('tools.safelink-decoder.input-placeholder')"
      autofocus
      :label="t('tools.safelink-decoder.input')"
    />

    <n-divider />

    <n-form-item :label="t('tools.safelink-decoder.output')">
      <TextareaCopyable :value="outputDecodedUrl" :word-wrap="true" />
    </n-form-item>
  </div>
</template>
