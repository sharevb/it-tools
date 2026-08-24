<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  Pa: { value: 'pascal', label: t('tools.pressure-converter.texts.label-pascal') },
  PPa: { value: 'pettapascal', label: t('tools.pressure-converter.texts.label-pettapascal') },
  TPa: { value: 'terapascal', label: t('tools.pressure-converter.texts.label-terapascal') },
  GPa: { value: 'gigapascal', label: t('tools.pressure-converter.texts.label-gigapascal') },
  MPa: { value: 'megapascal', label: t('tools.pressure-converter.texts.label-megapascal') },
  kPa: { value: 'kilopascal', label: t('tools.pressure-converter.texts.label-kilopascal') },
  hPa: { value: 'hectopascal', label: t('tools.pressure-converter.texts.label-hectopascal') },
  daPa: { value: 'decapascal', label: t('tools.pressure-converter.texts.label-decapascal') },
  dPa: { value: 'decipascal', label: t('tools.pressure-converter.texts.label-decipascal') },
  cPa: { value: 'centipascal', label: t('tools.pressure-converter.texts.label-centipascal') },
  mPa: { value: 'millipascal', label: t('tools.pressure-converter.texts.label-millipascal') },
  μPa: { value: 'micropascal', label: t('tools.pressure-converter.texts.label-micropascal') },
  nPa: { value: 'nanopascal', label: t('tools.pressure-converter.texts.label-nanopascal') },
  pPa: { value: 'picopascal', label: t('tools.pressure-converter.texts.label-picopascal') },
  fPa: { value: 'femtopascal', label: t('tools.pressure-converter.texts.label-femtopascal') },
  bar: { value: 'bar', label: t('tools.pressure-converter.texts.label-bar') },
  Pbar: { value: 'petabar', label: t('tools.pressure-converter.texts.label-petabar') },
  Tbar: { value: 'terabar', label: t('tools.pressure-converter.texts.label-terabar') },
  Gbar: { value: 'gigabar', label: t('tools.pressure-converter.texts.label-gigabar') },
  Mbar: { value: 'megabar', label: t('tools.pressure-converter.texts.label-megabar') },
  kbar: { value: 'kilobar', label: t('tools.pressure-converter.texts.label-kilobar') },
  hbar: { value: 'hectobar', label: t('tools.pressure-converter.texts.label-hectobar') },
  dabar: { value: 'decabar', label: t('tools.pressure-converter.texts.label-decabar') },
  dbar: { value: 'decibar', label: t('tools.pressure-converter.texts.label-decibar') },
  cbar: { value: 'centibar', label: t('tools.pressure-converter.texts.label-centibar') },
  mbar: { value: 'millibar', label: t('tools.pressure-converter.texts.label-millibar') },
  μbar: { value: 'microbar', label: t('tools.pressure-converter.texts.label-microbar') },
  nbar: { value: 'nanobar', label: t('tools.pressure-converter.texts.label-nanobar') },
  pbar: { value: 'picobar', label: t('tools.pressure-converter.texts.label-picobar') },
  fbar: { value: 'femtobar', label: t('tools.pressure-converter.texts.label-femtobar') },
  Torr: { value: 'torr', label: t('tools.pressure-converter.texts.label-torr') },
  mTorr: { value: 'millitorr', label: t('tools.pressure-converter.texts.label-millitorr') },
  atm: { value: 'atmosphere', label: t('tools.pressure-converter.texts.label-atmosphere') },
  psi: { value: 'pound per square inch', label: t('tools.pressure-converter.texts.label-pound-per-square-inch') },
  'lbf/in2': { value: 'lbf/in2', label: t('tools.pressure-converter.texts.label-lbf-in2') },
};
</script>

<template>
  <UnitsConverter default-unit="Pa" :supported-units="supportedUnits" label-width="150px" />
</template>
