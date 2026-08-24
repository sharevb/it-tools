<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  deg: { value: 'degree (°)', label: t('tools.angle-converter.texts.label-degree') },
  rad: { value: 'radian', label: t('tools.angle-converter.texts.label-radian') },
  turn: { value: 'turn', label: t('tools.angle-converter.texts.label-turn') },
  gradian: { value: 'gradian', label: t('tools.angle-converter.texts.label-gradian') },
  grad: { value: 'grad', label: t('tools.angle-converter.texts.label-grad') },
  gon: { value: 'gon', label: t('tools.angle-converter.texts.label-gon') },
};
</script>

<template>
  <UnitsConverter default-unit="deg" converter-type="convert" :supported-units="supportedUnits" label-width="150px" />
</template>
