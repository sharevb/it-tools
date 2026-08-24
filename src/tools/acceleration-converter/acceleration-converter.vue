<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  'g-force': { value: 'g-force', label: t('tools.acceleration-converter.texts.label-g-force') },
  'm/s2': { value: 'meter per second squared', label: t('tools.acceleration-converter.texts.label-meter-per-second-squared') },
};
</script>

<template>
  <UnitsConverter
    default-unit="g"
    converter-type="acceleration"
    :supported-units="supportedUnits"
    label-width="190px"
  />
</template>
