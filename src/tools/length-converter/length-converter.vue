<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  m: { value: 'meter', label: t('tools.length-converter.texts.label-meter') },
  Pm: { value: 'petameter', label: t('tools.length-converter.texts.label-petameter') },
  Tm: { value: 'terameter', label: t('tools.length-converter.texts.label-terameter') },
  Gm: { value: 'gigameter', label: t('tools.length-converter.texts.label-gigameter') },
  Mm: { value: 'megameter', label: t('tools.length-converter.texts.label-megameter') },
  km: { value: 'kilometer', label: t('tools.length-converter.texts.label-kilometer') },
  hm: { value: 'hectometer', label: t('tools.length-converter.texts.label-hectometer') },
  dam: { value: 'decameter', label: t('tools.length-converter.texts.label-decameter') },
  dm: { value: 'decimeter', label: t('tools.length-converter.texts.label-decimeter') },
  cm: { value: 'centimeter', label: t('tools.length-converter.texts.label-centimeter') },
  mm: { value: 'millimeter', label: t('tools.length-converter.texts.label-millimeter') },
  µm: { value: 'micrometer', label: t('tools.length-converter.texts.label-micrometer') },
  nm: { value: 'nanometer', label: t('tools.length-converter.texts.label-nanometer') },
  pm: { value: 'picometer', label: t('tools.length-converter.texts.label-picometer') },
  fm: { value: 'femtometer', label: t('tools.length-converter.texts.label-femtometer') },
  ft: { value: "foot (ft/')", label: "foot (ft/')" },
  in: { value: 'inch (")', label: t('tools.length-converter.texts.label-inch') },
  yd: { value: 'yard', label: t('tools.length-converter.texts.label-yard') },
  mi: { value: 'mile', label: t('tools.length-converter.texts.label-mile') },
  nmi: { value: 'nautical mile (M/NM)', label: t('tools.length-converter.texts.label-nautical-mile-m-nm') },
  ly: { value: 'light-year', label: t('tools.length-converter.texts.label-light-year') },
  pc: { value: 'parsec', label: t('tools.length-converter.texts.label-parsec') },
  pica: { value: 'pica', label: t('tools.length-converter.texts.label-pica') },
};
</script>

<template>
  <UnitsConverter default-unit="m" :supported-units="supportedUnits" label-width="150px" />
</template>
