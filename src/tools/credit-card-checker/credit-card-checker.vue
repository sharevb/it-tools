<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parse } from 'creditcard';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const cardNumber = useQueryParam({ tool: 'credit-card-validator', name: 'number', defaultValue: '' });
const parsed = computed(() => {
  if (!cardNumber.value) {
    return null;
  }
  return parse(cardNumber.value);
});
</script>

<template>
  <div style="max-width: 600px;">
    <c-input-text
      v-model:value="cardNumber"
      :label="t('tools.credit-card-checker.texts.label-credit-card-number')"
      label-position="left"
      :placeholder="t('tools.credit-card-checker.texts.placeholder-e-g-4111-1111-1111-1111')"
      mb-2
    />

    <n-alert v-if="parsed && !parsed.validates" type="error">
      {{ t('tools.credit-card-checker.texts.tag-invlid-credit-card-number') }}
    </n-alert>
    <n-card v-if="parsed && parsed.validates" :title="t('tools.credit-card-checker.texts.title-credit-card-number-info')">
      <input-copyable :label="t('tools.credit-card-checker.texts.label-formatted')" label-position="left" label-width="150px" mb-1 :value="parsed.formatted" />
      <input-copyable :label="t('tools.credit-card-checker.texts.label-pan-truncated')" label-position="left" label-width="150px" mb-1 :value="parsed.truncate" />
      <input-copyable :label="t('tools.credit-card-checker.texts.label-scheme')" label-position="left" label-width="150px" mb-1 :value="parsed.scheme || 'Unknown'" />
      <input-copyable :label="t('tools.credit-card-checker.texts.label-major-industry-identifier')" mb-1 :value="parsed.mii" />
      <input-copyable :label="t('tools.credit-card-checker.texts.label-issuer-identifier-number')" mb-1 :value="parsed.iin" />
      <input-copyable :label="t('tools.credit-card-checker.texts.label-cvv-length')" label-position="left" label-width="150px" mb-1 :value="parsed.cvv" />
    </n-card>
  </div>
</template>
