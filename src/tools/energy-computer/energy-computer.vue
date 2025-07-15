<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computeCost } from './energy-computer.service';

const { t } = useI18n();

const wattage = ref(100);
const durationHours = ref(2);
const kWhCost = ref(0.1);
const totalCost = computed(() => computeCost(wattage.value, durationHours.value, kWhCost.value));
</script>

<template>
  <div>
    <n-form-item :label="t('tools.energy-computer.texts.label-device-wattage')" mb-1>
      <n-input-number v-model:value="wattage" :min="0" />
    </n-form-item>
    <n-form-item :label="t('tools.energy-computer.texts.label-usage-duration-hours')" mb-1>
      <n-input-number v-model:value="durationHours" :min="0" />
    </n-form-item>
    <n-form-item :label="t('tools.energy-computer.texts.label-kwh-cost')" mb-1>
      <n-input-number v-model:value="kWhCost" :min="0" />
    </n-form-item>

    <n-divider />

    <input-copyable :label="t('tools.energy-computer.texts.label-total-cost')" :value="totalCost" />
  </div>
</template>
