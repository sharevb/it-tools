<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  W: { value: 'watt', label: t('tools.power-converter.texts.label-watt') },
  PW: { value: 'petawatt', label: t('tools.power-converter.texts.label-petawatt') },
  TW: { value: 'terawatt', label: t('tools.power-converter.texts.label-terawatt') },
  GW: { value: 'gigawatt', label: t('tools.power-converter.texts.label-gigawatt') },
  MW: { value: 'megawatt', label: t('tools.power-converter.texts.label-megawatt') },
  kW: { value: 'kilowatt', label: t('tools.power-converter.texts.label-kilowatt') },
  hW: { value: 'hectowatt', label: t('tools.power-converter.texts.label-hectowatt') },
  daW: { value: 'decawatt', label: t('tools.power-converter.texts.label-decawatt') },
  dW: { value: 'deciwatt', label: t('tools.power-converter.texts.label-deciwatt') },
  cW: { value: 'centiwatt', label: t('tools.power-converter.texts.label-centiwatt') },
  mW: { value: 'milliwatt', label: t('tools.power-converter.texts.label-milliwatt') },
  μW: { value: 'microwatt', label: t('tools.power-converter.texts.label-microwatt') },
  nW: { value: 'nanowatt', label: t('tools.power-converter.texts.label-nanowatt') },
  pW: { value: 'picowatt', label: t('tools.power-converter.texts.label-picowatt') },
  fW: { value: 'femtowatt', label: t('tools.power-converter.texts.label-femtowatt') },
  horsepower: { value: 'horsepower', label: t('tools.power-converter.texts.label-horsepower') },
  hp: { value: 'mechanical horsepower', label: t('tools.power-converter.texts.label-mechanical-horsepower') },
};
</script>

<template>
  <UnitsConverter default-unit="W" converter-type="convert" :supported-units="supportedUnits" label-width="150px" />
</template>
