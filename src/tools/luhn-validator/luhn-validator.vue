<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Luhn from 'luhn-js';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const rawValue = useQueryParam({ tool: 'luhn-validator', name: 'luhn', defaultValue: '44540661970241257' });
const cleanedValue = computed(() => rawValue.value.replace(/[^\d]/g, ''));
const isValid = computed(() => {
  try {
    return Luhn.isValid(cleanedValue.value);
  }
  catch (_) {
    return false;
  }
});
const luhnInfos = computed<CKeyValueListItems>(() => {
  return [
    {
      label: t('tools.luhn-validator.texts.label-is-valid'),
      value: isValid.value,
    },
    {
      label: t('tools.luhn-validator.texts.label-luhn-key'),
      value: (isValid.value
        ? cleanedValue.value.slice(-1)
        : Luhn.generate(cleanedValue.value).slice(-1)) || '',
    },
    {
      label: t('tools.luhn-validator.texts.label-value-with-luhn-key'),
      value: (isValid.value
        ? cleanedValue.value
        : Luhn.generate(cleanedValue.value)) || '',
    },
  ];
});
</script>

<template>
  <div>
    <c-input-text v-model:value="rawValue" :placeholder="t('tools.luhn-validator.texts.placeholder-enter-a-luhn-validated-value')" />
    <n-alert v-if="!isValid" type="error">
      {{ t('tools.luhn-validator.texts.tag-invalid-luhn-key') }}<input-copyable :label="t('tools.luhn-validator.texts.label-probably-correct')" label-position="left" :value="Luhn.generate(cleanedValue)" disabled="true" />
    </n-alert>

    <c-card v-if="luhnInfos.length > 0" mt-5 :title="t('tools.luhn-validator.texts.title-infos')">
      <c-key-value-list :items="luhnInfos" />
    </c-card>
  </div>
</template>
