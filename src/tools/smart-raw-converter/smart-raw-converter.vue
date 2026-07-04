<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getSmartValue } from './smart-raw-converter.service';
import { useValidation } from '@/composable/validation';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const inputRegex = /^(?:0x(?<hex>[a-f\d]+)|(?<dec>\d+))$/i;
const rawValue = useQueryParam({ tool: 'smart-raw-conv', name: 'raw', defaultValue: '0xFE45E3' });
const rawValueValidation = useValidation({
  source: rawValue,
  rules: [
    {
      validator: (v) => {
        return inputRegex.test(v?.trim());
      },
      message: t('tools.smart-raw-converter.texts.message-smart-raw-value-must-be-decimal-or-0x-hexadecimal'),
    },
  ],
});
const smartDecodedValue = computed(() => {
  if (!rawValueValidation.isValid) {
    return null;
  }
  const inputMatch = rawValue.value.match(inputRegex);
  const rawValueInt = inputMatch?.groups?.hex
    ? Number.parseInt(inputMatch?.groups?.hex, 16)
    : Number.parseInt(inputMatch?.groups?.dec || '0', 10);
  return getSmartValue(rawValueInt);
});
</script>

<template>
  <div max-w-600px>
    <c-input-text
      v-model:value="rawValue"
      :label="t('tools.smart-raw-converter.texts.label-smart-raw-value')"
      :placeholder="t('tools.smart-raw-converter.texts.placeholder-put-your-smart-raw-value-decimal-or-0x-hexa')"
      :validation="rawValueValidation"
      mb-2
    />

    <c-card v-if="smartDecodedValue" :title="t('tools.smart-raw-converter.texts.title-decoded')">
      <strong>{{ smartDecodedValue.errors }}</strong> in {{ smartDecodedValue.operations }} operations
    </c-card>
  </div>
</template>
