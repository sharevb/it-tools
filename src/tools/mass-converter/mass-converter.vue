<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  g: { value: 'gram', label: t('tools.mass-converter.texts.label-gram') },
  Pg: { value: 'petagram', label: t('tools.mass-converter.texts.label-petagram') },
  Tg: { value: 'teragram', label: t('tools.mass-converter.texts.label-teragram') },
  Gg: { value: 'gigagram', label: t('tools.mass-converter.texts.label-gigagram') },
  Mg: { value: 'megagram', label: t('tools.mass-converter.texts.label-megagram') },
  kg: { value: 'kilogram', label: t('tools.mass-converter.texts.label-kilogram') },
  hg: { value: 'hectogram', label: t('tools.mass-converter.texts.label-hectogram') },
  dag: { value: 'decagram', label: t('tools.mass-converter.texts.label-decagram') },
  dg: { value: 'decigram', label: t('tools.mass-converter.texts.label-decigram') },
  cg: { value: 'centigram', label: t('tools.mass-converter.texts.label-centigram') },
  mg: { value: 'milligram', label: t('tools.mass-converter.texts.label-milligram') },
  μg: { value: 'microgram', label: t('tools.mass-converter.texts.label-microgram') },
  ng: { value: 'nanogram', label: t('tools.mass-converter.texts.label-nanogram') },
  pg: { value: 'picogram', label: t('tools.mass-converter.texts.label-picogram') },
  fg: { value: 'femtogram', label: t('tools.mass-converter.texts.label-femtogram') },
  tonne: { value: 'tonne', label: t('tools.mass-converter.texts.label-tonne') },
  t: { value: 'metric ton', label: t('tools.mass-converter.texts.label-metric-ton') },
  kt: { value: 'kilotonne', label: t('tools.mass-converter.texts.label-kilotonne') },
  Mt: { value: 'megatonne', label: t('tools.mass-converter.texts.label-megatonne') },
  Gt: { value: 'gigatonne', label: t('tools.mass-converter.texts.label-gigatonne') },
  lb: { value: 'pound', label: t('tools.mass-converter.texts.label-pound') },
  st: { value: 'stone', label: t('tools.mass-converter.texts.label-stone') },
  oz: { value: 'ounce', label: t('tools.mass-converter.texts.label-ounce') },
  'short ton': { value: 'short ton', label: t('tools.mass-converter.texts.label-short-ton') },
  'US ton': { value: 'US ton', label: t('tools.mass-converter.texts.label-us-ton') },
  'long ton': { value: 'long ton', label: t('tools.mass-converter.texts.label-long-ton') },
  'imperial ton': { value: 'imperial ton', label: t('tools.mass-converter.texts.label-imperial-ton') },
  'displacement ton': { value: 'displacement ton', label: t('tools.mass-converter.texts.label-displacement-ton') },
};
</script>

<template>
  <UnitsConverter default-unit="g" :supported-units="supportedUnits" label-width="150px" />
</template>
