<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computeCost } from './energy-computer.service';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const wattage = useQueryParam({ tool: 'energy-computer', name: 'wattage', defaultValue: 100 });
const durationHours = useQueryParam({ tool: 'energy-computer', name: 'hours', defaultValue: 2 });
const kWhCost = useQueryParam({ tool: 'energy-computer', name: 'cost', defaultValue: 0.1 });
const totalCost = computed(() => computeCost(wattage.value, durationHours.value, kWhCost.value));
</script>

<template>
  <div>
    <n-form-item :label="t('tools.energy-computer.texts.label-device-wattage')" mb-1>
      <n-input-number-i18n v-model:value="wattage" :min="0" />
    </n-form-item>
    <n-form-item :label="t('tools.energy-computer.texts.label-usage-duration-hours')" mb-1>
      <n-input-number-i18n v-model:value="durationHours" :min="0" />
    </n-form-item>
    <n-form-item :label="t('tools.energy-computer.texts.label-kwh-cost')" mb-1>
      <n-input-number-i18n v-model:value="kWhCost" :min="0" />
    </n-form-item>

    <n-divider />

    <input-copyable :label="t('tools.energy-computer.texts.label-total-cost')" :value="totalCost.toFixed(3)" />
  </div>
</template>
