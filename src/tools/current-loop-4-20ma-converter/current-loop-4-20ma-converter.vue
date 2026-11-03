<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AnalogSignalConverter from '@/components/AnalogSignalConverter.vue';

const { t } = useI18n();

const presets = [
  { label: '4-20 mA', min: 4, max: 20 },
  { label: '0-20 mA', min: 0, max: 20 },
];
</script>

<template>
  <AnalogSignalConverter
    storage-key="current-loop-4-20ma-converter"
    :signal-label="t('tools.current-loop-4-20ma-converter.texts.signal-label')"
    signal-unit="mA"
    :presets="presets"
    :default-engineering="{ min: 0, max: 10, unit: 'bar' }"
    current-loop-diagnostic
  />
</template>
