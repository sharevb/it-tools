<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AnalogSignalConverter from '@/components/AnalogSignalConverter.vue';

const { t } = useI18n();

const presets = computed(() => [
  { label: t('tools.analog-scaling-calculator.texts.preset-siemens-unipolar'), min: 0, max: 27648 },
  { label: t('tools.analog-scaling-calculator.texts.preset-siemens-bipolar'), min: -27648, max: 27648 },
  { label: t('tools.analog-scaling-calculator.texts.preset-schneider'), min: 0, max: 10000 },
  { label: t('tools.analog-scaling-calculator.texts.preset-12-bits'), min: 0, max: 4095 },
  { label: t('tools.analog-scaling-calculator.texts.preset-15-bits'), min: 0, max: 32767 },
  { label: t('tools.analog-scaling-calculator.texts.preset-16-bits'), min: 0, max: 65535 },
]);
</script>

<template>
  <AnalogSignalConverter
    storage-key="analog-scaling-calculator"
    :signal-label="t('tools.analog-scaling-calculator.texts.signal-label')"
    :presets="presets"
    :default-engineering="{ min: 0, max: 100, unit: '%' }"
    integer-signal
  />
</template>
