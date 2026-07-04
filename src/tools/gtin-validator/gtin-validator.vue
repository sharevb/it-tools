<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  calculateCheckDigitForGTIN,
  getFormatOfGTIN,
  getFormatOfMinifiedGTIN,
  isValidGTIN,
  removeGTINLeadingZerosToUpcOrGTIN13,
} from 'gtin-validator';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const input = useQueryParam({ tool: 'gtin-validator', name: 'gtin', defaultValue: '' });

const results = computed(() => {
  if (!input.value) {
    return null;
  }

  const gtin = input.value.trim();
  const getValueOrError = (func: () => string) => {
    try {
      return func();
    }
    catch (e: any) {
      return e.toString();
    }
  };
  const isValid = isValidGTIN(gtin);
  return {
    minified: getValueOrError(() => removeGTINLeadingZerosToUpcOrGTIN13(gtin)),
    format: getValueOrError(() => getFormatOfGTIN(gtin)),
    minifiedFormat: getValueOrError(() => getFormatOfMinifiedGTIN(gtin)),
    checkDigit: getValueOrError(() => isValid ? calculateCheckDigitForGTIN(gtin.slice(0, -1)) : calculateCheckDigitForGTIN(gtin)),
    isValid,
    message: getValueOrError(() => isValidGTIN(gtin, 'error') ? 'ok' : 'nok'),
  };
});
</script>

<template>
  <div style="max-width: 600px; margin: auto;">
    <c-input-text
      v-model:value="input"
      :placeholder="t('tools.gtin-validator.texts.placeholder-enter-gtin-e-g-4006381333931')"
      :label="t('tools.gtin-validator.texts.label-gtin')" label-position="left"
      mb-2
    />

    <n-card v-if="results" :title="t('tools.gtin-validator.texts.title-validation')">
      <n-alert v-if="!results.isValid" type="error" mb-2>
        {{ results.message }}
      </n-alert>
      <n-alert v-else type="success" mb-2>
        {{ t('tools.gtin-validator.texts.tag-gtin-is-valid') }}
      </n-alert>

      <input-copyable :value="results.format" :label="t('tools.gtin-validator.texts.label-format')" label-position="left" label-width="120px" mb-1 />
      <input-copyable :value="results.minified" :label="t('tools.gtin-validator.texts.label-minified')" label-position="left" label-width="120px" mb-1 />
      <input-copyable :value="results.minifiedFormat" :label="t('tools.gtin-validator.texts.label-minified-format')" label-position="left" label-width="120px" mb-1 />
      <input-copyable :value="results.checkDigit" :label="t('tools.gtin-validator.texts.label-check-digit')" label-position="left" label-width="120px" mb-1 />
    </n-card>
  </div>
</template>
