<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkVAT, countries } from 'jsvat-next';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const rawVATNumber = useQueryParam({ tool: 'vat-validator', name: 'vat', defaultValue: 'BE0411905847' });
const vatInfos = computed<{ isValid: boolean; infos: CKeyValueListItems }>(() => {
  const vat = checkVAT(rawVATNumber.value, countries);
  if (vat == null) {
    return { isValid: false, infos: [] };
  }
  return {
    isValid: vat.isValid,
    infos: [
      {
        label: t('tools.vat-validator.texts.label-is-vat-number-valid'),
        value: vat.isValid,
      },
      {
        label: t('tools.vat-validator.texts.label-is-vat-number-valid-format'),
        value: vat.isValidFormat,
      },
      {
        label: t('tools.vat-validator.texts.label-cleaned-vat-number'),
        value: vat.value,
      },
      {
        label: t('tools.vat-validator.texts.label-country-name'),
        value: vat.country?.name || 'Unknown',
      },
      {
        label: t('tools.vat-validator.texts.label-country-iso2'),
        value: vat.country?.isoCode?.short || 'unk',
      },
      {
        label: t('tools.vat-validator.texts.label-country-iso3'),
        value: vat.country?.isoCode?.long || 'unk',
      },
      {
        label: t('tools.vat-validator.texts.label-country-iso-num'),
        value: vat.country?.isoCode?.numeric || 0,
      },
    ],
  };
});
</script>

<template>
  <div>
    <c-input-text v-model:value="rawVATNumber" :placeholder="t('tools.vat-validator.texts.placeholder-enter-a-vat-number-to-check-for-validity')" test-id="vat-input" mb-2 />
    <n-alert v-if="!vatInfos.isValid" type="error" mb-2>
      {{ t('tools.vat-validator.texts.tag-invalid-vat-number') }}
    </n-alert>

    <c-card v-if="vatInfos.infos.length > 0" :title="t('tools.vat-validator.texts.title-vat-number-infos')">
      <c-key-value-list :items="vatInfos.infos" data-test-id="vat-info" />
    </c-card>
  </div>
</template>
