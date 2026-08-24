<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  Hz: { value: 'hertz', label: t('tools.frequency-converter.texts.label-hertz') },
  mHz: { value: 'millihertz', label: t('tools.frequency-converter.texts.label-millihertz') },
  kHz: { value: 'kilohertz', label: t('tools.frequency-converter.texts.label-kilohertz') },
  MHz: { value: 'megahertz', label: t('tools.frequency-converter.texts.label-megahertz') },
  GHz: { value: 'gigahertz', label: t('tools.frequency-converter.texts.label-gigahertz') },
  THz: { value: 'terahertz', label: t('tools.frequency-converter.texts.label-terahertz') },
  rpm: { value: 'revolutions per minute', label: t('tools.frequency-converter.texts.label-revolutions-per-minute') },
  'deg/s': { value: 'degree per second', label: t('tools.frequency-converter.texts.label-degree-per-second') },
  'rad/s': { value: 'radian per second', label: t('tools.frequency-converter.texts.label-radian-per-second') },
};
</script>

<template>
  <UnitsConverter default-unit="Hz" converter-type="frequency" :supported-units="supportedUnits" label-width="160px" />
</template>
