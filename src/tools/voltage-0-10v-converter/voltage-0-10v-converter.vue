<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AnalogSignalConverter from '@/components/AnalogSignalConverter.vue';

const { t } = useI18n();

const presets = [
  { label: '0-10 V', min: 0, max: 10 },
  { label: '2-10 V', min: 2, max: 10 },
  { label: '0-5 V', min: 0, max: 5 },
  { label: '1-5 V', min: 1, max: 5 },
  { label: '±10 V', min: -10, max: 10 },
];
</script>

<template>
  <AnalogSignalConverter
    storage-key="voltage-0-10v-converter"
    :signal-label="t('tools.voltage-0-10v-converter.texts.signal-label')"
    signal-unit="V"
    :presets="presets"
    :default-engineering="{ min: 0, max: 100, unit: '%' }"
  />
</template>
