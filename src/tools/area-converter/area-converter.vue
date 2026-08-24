<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  'm²': { value: 'square meter', label: t('tools.area-converter.texts.label-square-meter') },
  'Pm²': { value: 'square petameter', label: t('tools.area-converter.texts.label-square-petameter') },
  'Tm²': { value: 'square terameter', label: t('tools.area-converter.texts.label-square-terameter') },
  'Gm²': { value: 'square gigameter', label: t('tools.area-converter.texts.label-square-gigameter') },
  'Mm²': { value: 'square megameter', label: t('tools.area-converter.texts.label-square-megameter') },
  'km²': { value: 'square kilometer', label: t('tools.area-converter.texts.label-square-kilometer') },
  'hm²': { value: 'square hectometer', label: t('tools.area-converter.texts.label-square-hectometer') },
  'dam²': { value: 'square decameter', label: t('tools.area-converter.texts.label-square-decameter') },
  'dm²': { value: 'square decimeter', label: t('tools.area-converter.texts.label-square-decimeter') },
  'cm²': { value: 'square centimeter', label: t('tools.area-converter.texts.label-square-centimeter') },
  'mm²': { value: 'square millimeter', label: t('tools.area-converter.texts.label-square-millimeter') },
  'μm²': { value: 'square micrometer', label: t('tools.area-converter.texts.label-square-micrometer') },
  'nm²': { value: 'square nanometer', label: t('tools.area-converter.texts.label-square-nanometer') },
  'pm²': { value: 'square picometer', label: t('tools.area-converter.texts.label-square-picometer') },
  'fm²': { value: 'square femtometer', label: t('tools.area-converter.texts.label-square-femtometer') },
  ac: { value: 'acre', label: t('tools.area-converter.texts.label-acre') },
  ca: { value: 'centiare', label: t('tools.area-converter.texts.label-centiare') },
  da: { value: 'deciare', label: t('tools.area-converter.texts.label-deciare') },
  are: { value: 'are', label: t('tools.area-converter.texts.label-are') },
  daa: { value: 'decare', label: t('tools.area-converter.texts.label-decare') },
  ha: { value: 'hectare', label: t('tools.area-converter.texts.label-hectare') },
  'ft²': { value: 'square foot (/ft2/sq ft)', label: t('tools.area-converter.texts.label-square-foot-ft2-sq-ft') },
  'in²': { value: 'square inch (/in2/sq in)', label: t('tools.area-converter.texts.label-square-inch-in2-sq-in') },
  'yd²': { value: 'square yard (yd2/sq yd)', label: t('tools.area-converter.texts.label-square-yard-yd2-sq-yd') },
  'mi²': { value: 'square mile (mi2/sq mi)', label: t('tools.area-converter.texts.label-square-mile-mi2-sq-mi') },
};
</script>

<template>
  <UnitsConverter default-unit="m²" :supported-units="supportedUnits" label-width="150px" />
</template>
