<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  N: { value: 'newton', label: t('tools.force-converter.texts.label-newton') },
  PN: { value: 'petanewton', label: t('tools.force-converter.texts.label-petanewton') },
  TN: { value: 'teranewton', label: t('tools.force-converter.texts.label-teranewton') },
  GN: { value: 'giganewton', label: t('tools.force-converter.texts.label-giganewton') },
  MN: { value: 'meganewton', label: t('tools.force-converter.texts.label-meganewton') },
  kN: { value: 'kilonewton', label: t('tools.force-converter.texts.label-kilonewton') },
  hN: { value: 'hectonewton', label: t('tools.force-converter.texts.label-hectonewton') },
  daN: { value: 'decanewton', label: t('tools.force-converter.texts.label-decanewton') },
  dN: { value: 'decinewton', label: t('tools.force-converter.texts.label-decinewton') },
  cN: { value: 'centinewton', label: t('tools.force-converter.texts.label-centinewton') },
  mN: { value: 'millinewton', label: t('tools.force-converter.texts.label-millinewton') },
  µN: { value: 'micronewton', label: t('tools.force-converter.texts.label-micronewton') },
  nN: { value: 'nanonewton', label: t('tools.force-converter.texts.label-nanonewton') },
  pN: { value: 'piconewton', label: t('tools.force-converter.texts.label-piconewton') },
  fN: { value: 'femtonewton', label: t('tools.force-converter.texts.label-femtonewton') },
  dyn: { value: 'dyne', label: t('tools.force-converter.texts.label-dyne') },
  lbf: { value: 'pound of force', label: t('tools.force-converter.texts.label-pound-of-force') },
  kip: { value: 'kip', label: t('tools.force-converter.texts.label-kip') },
  klb: { value: 'klb', label: t('tools.force-converter.texts.label-klb') },
  kipf: { value: 'kipf', label: t('tools.force-converter.texts.label-kipf') },
  klbf: { value: 'klbf', label: t('tools.force-converter.texts.label-klbf') },
  pdl: { value: 'poundal', label: t('tools.force-converter.texts.label-poundal') },
  kgf: { value: 'kilogram-force', label: t('tools.force-converter.texts.label-kilogram-force') },
  kp: { value: 'kilopond', label: t('tools.force-converter.texts.label-kilopond') },
  Mp: { value: 'megapond', label: t('tools.force-converter.texts.label-megapond') },
  tf: { value: 'tonne-force', label: t('tools.force-converter.texts.label-tonne-force') },
  'metric tf': { value: 'metric ton-force', label: t('tools.force-converter.texts.label-metric-ton-force') },
  'megagram-force': { value: 'megagram-force', label: t('tools.force-converter.texts.label-megagram-force') },
};
</script>

<template>
  <UnitsConverter default-unit="N" converter-type="convert" :supported-units="supportedUnits" label-width="150px" />
</template>
