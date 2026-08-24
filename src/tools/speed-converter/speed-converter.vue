<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  'm/s': { value: 'meter per second', label: t('tools.speed-converter.texts.label-meter-per-second') },
  'km/h': { value: 'kilometer per hour', label: t('tools.speed-converter.texts.label-kilometer-per-hour') },
  'mi/h': { value: 'miles per hour', label: t('tools.speed-converter.texts.label-miles-per-hour') },
  knot: { value: 'knot', label: t('tools.speed-converter.texts.label-knot') },
  'ft/s': { value: 'feet per second', label: t('tools.speed-converter.texts.label-feet-per-second') },
};
</script>

<template>
  <UnitsConverter default-unit="m/s" converter-type="speed" :supported-units="supportedUnits" label-width="150px" />
</template>
