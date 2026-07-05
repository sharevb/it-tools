<script setup lang="ts">
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  W: 'watt',
  PW: 'petawatt',
  TW: 'terawatt',
  GW: 'gigawatt',
  MW: 'megawatt',
  kW: 'kilowatt',
  hW: 'hectowatt',
  daW: 'decawatt',
  dW: 'deciwatt',
  cW: 'centiwatt',
  mW: 'milliwatt',
  μW: 'microwatt',
  nW: 'nanowatt',
  pW: 'picowatt',
  fW: 'femtowatt',
  horsepower: 'horsepower',
  hp: 'mechanical horsepower',
};
</script>

<template>
  <UnitsConverter default-unit="W" converter-type="convert" :supported-units="supportedUnits" label-width="150px" />
</template>
