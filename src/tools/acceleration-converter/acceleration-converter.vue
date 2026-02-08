<script setup lang="ts">
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  'g-force': 'g-force',
  'm/s2': 'meter per second squared',
}; ;
</script>

<template>
  <UnitsConverter default-unit="g" converter-type="acceleration" :supported-units="supportedUnits" label-width="190px" />
</template>
