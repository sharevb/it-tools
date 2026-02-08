<script setup lang="ts">
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  'mm3/s': 'cubic millimeters per second',
  'cm3/s': 'cubic centimeters per second',
  'ml/s': 'milliliters per second',
  'cl/s': 'centiliters per second',
  'dl/s': 'deciliters per second',
  'l/s': 'liters per second',
  'l/min': 'liters per minute',
  'l/h': 'liters per hour',
  'kl/s': 'kiloliters per second',
  'kl/min': 'kiloliters per minute',
  'kl/h': 'kiloliters per hour',
  'm3/s': 'cubic meters per second',
  'm3/min': 'cubic meters per minute',
  'm3/h': 'cubic meters per hour',
  'km3/s': 'cubic kilometers per second',

  'tsp/s': 'teaspoons per second',
  'Tbs/s': 'tablespoons per second',

  'in3/s': 'cubic inches per second',
  'in3/min': 'cubic inches per minute',
  'in3/h': 'cubic inches per hour',

  'fl-oz/s': 'fluid ounces per second',
  'fl-oz/min': 'fluid ounces per minute',
  'fl-oz/h': 'fluid ounces per hour',

  'cup/s': 'cups per second',

  'pnt/s': 'pints per second',
  'pnt/min': 'pints per minute',
  'pnt/h': 'pints per hour',

  'qt/s': 'quarts per second',

  'gal/s': 'gallons per second',
  'gal/min': 'gallons per minute',
  'gal/h': 'gallons per hour',

  'ft3/s': 'cubic feet per second',
  'ft3/min': 'cubic feet per minute',
  'ft3/h': 'cubic feet per hour',

  'yd3/s': 'cubic yards per second',
  'yd3/min': 'cubic yards per minute',
  'yd3/h': 'cubic yards per hour',
};
</script>

<template>
  <UnitsConverter default-unit="l/s" converter-type="volumeFlowRate" :supported-units="supportedUnits" label-width="200px" />
</template>
