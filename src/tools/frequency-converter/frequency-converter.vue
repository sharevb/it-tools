<script setup lang="ts">
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  'Hz': 'hertz',
  'mHz': 'millihertz',
  'kHz': 'kilohertz',
  'MHz': 'megahertz',
  'GHz': 'gigahertz',
  'THz': 'terahertz',
  'rpm': 'revolutions per minute',
  'deg/s': 'degree per second',
  'rad/s': 'radian per second',
}; ;
</script>

<template>
  <UnitsConverter default-unit="Hz" converter-type="frequency" :supported-units="supportedUnits" label-width="160px" />
</template>
