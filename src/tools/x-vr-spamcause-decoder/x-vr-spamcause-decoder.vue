<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { spamCauseDecode } from './x-vr-spamcause-decoder.service';

const { t } = useI18n();

const encodedXVRSpamCause = ref('');
const decoded = computed(() => spamCauseDecode(encodedXVRSpamCause.value));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="encodedXVRSpamCause"
      :label="t('tools.x-vr-spamcause-decoder.texts.label-encoded-x-vr-spamcause')"
      multiline
      rows="1"
      autosize
      :placeholder="t('tools.x-vr-spamcause-decoder.texts.placeholder-your-x-vr-spamcause-header-value')"
      mb-6
    />

    <n-divider />

    <textarea-copyable readonly :label="t('tools.x-vr-spamcause-decoder.texts.label-decoded')" :value="decoded" />
  </div>
</template>
