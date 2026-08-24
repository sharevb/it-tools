<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  J: { value: 'joule', label: t('tools.energy-converter.texts.label-joule') },
  PJ: { value: 'petajoule', label: t('tools.energy-converter.texts.label-petajoule') },
  TJ: { value: 'terajoule', label: t('tools.energy-converter.texts.label-terajoule') },
  GJ: { value: 'gigajoule', label: t('tools.energy-converter.texts.label-gigajoule') },
  MJ: { value: 'megajoule', label: t('tools.energy-converter.texts.label-megajoule') },
  kJ: { value: 'kilojoule', label: t('tools.energy-converter.texts.label-kilojoule') },
  hJ: { value: 'hectojoule', label: t('tools.energy-converter.texts.label-hectojoule') },
  daJ: { value: 'decajoule', label: t('tools.energy-converter.texts.label-decajoule') },
  dJ: { value: 'decijoule', label: t('tools.energy-converter.texts.label-decijoule') },
  cJ: { value: 'centijoule', label: t('tools.energy-converter.texts.label-centijoule') },
  mJ: { value: 'millijoule', label: t('tools.energy-converter.texts.label-millijoule') },
  µJ: { value: 'microjoule', label: t('tools.energy-converter.texts.label-microjoule') },
  nJ: { value: 'nanojoule', label: t('tools.energy-converter.texts.label-nanojoule') },
  pJ: { value: 'picojoule', label: t('tools.energy-converter.texts.label-picojoule') },
  fJ: { value: 'femtojoule', label: t('tools.energy-converter.texts.label-femtojoule') },
  Wh: { value: 'watt-hour', label: t('tools.energy-converter.texts.label-watt-hour') },
  PWh: { value: 'petawatt-hour', label: t('tools.energy-converter.texts.label-petawatt-hour') },
  TWh: { value: 'terawatt-hour', label: t('tools.energy-converter.texts.label-terawatt-hour') },
  GWh: { value: 'gigawatt-hour', label: t('tools.energy-converter.texts.label-gigawatt-hour') },
  MWh: { value: 'megawatt-hour', label: t('tools.energy-converter.texts.label-megawatt-hour') },
  kWh: { value: 'kilowatt-hour', label: t('tools.energy-converter.texts.label-kilowatt-hour') },
  hWh: { value: 'hectowatt-hour', label: t('tools.energy-converter.texts.label-hectowatt-hour') },
  daWh: { value: 'decawatt-hour', label: t('tools.energy-converter.texts.label-decawatt-hour') },
  dWh: { value: 'deciwatt-hour', label: t('tools.energy-converter.texts.label-deciwatt-hour') },
  cWh: { value: 'centiwatt-hour', label: t('tools.energy-converter.texts.label-centiwatt-hour') },
  mWh: { value: 'milliwatt-hour', label: t('tools.energy-converter.texts.label-milliwatt-hour') },
  µWh: { value: 'microwatt-hour', label: t('tools.energy-converter.texts.label-microwatt-hour') },
  nWh: { value: 'nanowatt-hour', label: t('tools.energy-converter.texts.label-nanowatt-hour') },
  pWh: { value: 'picowatt-hour', label: t('tools.energy-converter.texts.label-picowatt-hour') },
  fWh: { value: 'femtowatt-hour', label: t('tools.energy-converter.texts.label-femtowatt-hour') },
};
</script>

<template>
  <UnitsConverter default-unit="J" :supported-units="supportedUnits" label-width="150px" />
</template>
