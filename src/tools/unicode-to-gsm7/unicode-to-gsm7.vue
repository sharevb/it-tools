<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { convertUnicodeToGSM7 } from '@skeepit/unicode-to-gsm7';
import { SegmentedMessage } from 'sms-segments-calculator';

const { t } = useI18n();

const smsInfo = ref<SegmentedMessage | null>(null);

function transformer(value: string) {
  smsInfo.value = null;
  if (value === '') {
    return '';
  }

  try {
    smsInfo.value = new SegmentedMessage(value);
    return convertUnicodeToGSM7(value);
  }
  catch (e: any) {
    return e.toString();
  }
}
</script>

<template>
  <format-transformer
    :input-label="t('tools.unicode-to-gsm7.texts.input-label-your-text-to-encode-to-gsm-7')"
    :input-placeholder="t('tools.unicode-to-gsm7.texts.input-placeholder-put-your-text-here')"
    :output-label="t('tools.unicode-to-gsm7.texts.output-label-gsm-7-encoded-version')"
    :transformer="transformer"
  />

  <n-card v-if="smsInfo" :title="t('tools.unicode-to-gsm7.texts.title-sms-info')">
    <input-copyable :label="t('tools.unicode-to-gsm7.texts.label-encoding')" label-position="left" :value="smsInfo.encodingName" mb-1 />
    <input-copyable :label="t('tools.unicode-to-gsm7.texts.label-message-size')" label-position="left" :value="smsInfo.messageSize" mb-1 />
    <input-copyable :label="t('tools.unicode-to-gsm7.texts.label-total-size')" label-position="left" :value="smsInfo.totalSize" mb-1 />
    <input-copyable :label="t('tools.unicode-to-gsm7.texts.label-segments-count')" label-position="left" :value="smsInfo.segmentsCount" mb-1 />
    <input-copyable :label="t('tools.unicode-to-gsm7.texts.label-non-gsm-7-characters')" label-position="left" :value="[...new Set(smsInfo.getNonGsmCharacters())].join(',')" />
  </n-card>
</template>
