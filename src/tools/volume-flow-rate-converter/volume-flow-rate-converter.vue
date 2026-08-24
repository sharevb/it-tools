<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import UnitsConverter from '@/components/UnitsConverter.vue';

const supportedUnits = {
  'mm3/s': { value: 'cubic millimeters per second', label: t('tools.volume-flow-rate-converter.texts.label-cubic-millimeters-per-second') },
  'cm3/s': { value: 'cubic centimeters per second', label: t('tools.volume-flow-rate-converter.texts.label-cubic-centimeters-per-second') },
  'ml/s': { value: 'milliliters per second', label: t('tools.volume-flow-rate-converter.texts.label-milliliters-per-second') },
  'cl/s': { value: 'centiliters per second', label: t('tools.volume-flow-rate-converter.texts.label-centiliters-per-second') },
  'dl/s': { value: 'deciliters per second', label: t('tools.volume-flow-rate-converter.texts.label-deciliters-per-second') },
  'l/s': { value: 'liters per second', label: t('tools.volume-flow-rate-converter.texts.label-liters-per-second') },
  'l/min': { value: 'liters per minute', label: t('tools.volume-flow-rate-converter.texts.label-liters-per-minute') },
  'l/h': { value: 'liters per hour', label: t('tools.volume-flow-rate-converter.texts.label-liters-per-hour') },
  'kl/s': { value: 'kiloliters per second', label: t('tools.volume-flow-rate-converter.texts.label-kiloliters-per-second') },
  'kl/min': { value: 'kiloliters per minute', label: t('tools.volume-flow-rate-converter.texts.label-kiloliters-per-minute') },
  'kl/h': { value: 'kiloliters per hour', label: t('tools.volume-flow-rate-converter.texts.label-kiloliters-per-hour') },
  'm3/s': { value: 'cubic meters per second', label: t('tools.volume-flow-rate-converter.texts.label-cubic-meters-per-second') },
  'm3/min': { value: 'cubic meters per minute', label: t('tools.volume-flow-rate-converter.texts.label-cubic-meters-per-minute') },
  'm3/h': { value: 'cubic meters per hour', label: t('tools.volume-flow-rate-converter.texts.label-cubic-meters-per-hour') },
  'km3/s': { value: 'cubic kilometers per second', label: t('tools.volume-flow-rate-converter.texts.label-cubic-kilometers-per-second') },

  'tsp/s': { value: 'teaspoons per second', label: t('tools.volume-flow-rate-converter.texts.label-teaspoons-per-second') },
  'Tbs/s': { value: 'tablespoons per second', label: t('tools.volume-flow-rate-converter.texts.label-tablespoons-per-second') },

  'in3/s': { value: 'cubic inches per second', label: t('tools.volume-flow-rate-converter.texts.label-cubic-inches-per-second') },
  'in3/min': { value: 'cubic inches per minute', label: t('tools.volume-flow-rate-converter.texts.label-cubic-inches-per-minute') },
  'in3/h': { value: 'cubic inches per hour', label: t('tools.volume-flow-rate-converter.texts.label-cubic-inches-per-hour') },

  'fl-oz/s': { value: 'fluid ounces per second', label: t('tools.volume-flow-rate-converter.texts.label-fluid-ounces-per-second') },
  'fl-oz/min': { value: 'fluid ounces per minute', label: t('tools.volume-flow-rate-converter.texts.label-fluid-ounces-per-minute') },
  'fl-oz/h': { value: 'fluid ounces per hour', label: t('tools.volume-flow-rate-converter.texts.label-fluid-ounces-per-hour') },

  'cup/s': { value: 'cups per second', label: t('tools.volume-flow-rate-converter.texts.label-cups-per-second') },

  'pnt/s': { value: 'pints per second', label: t('tools.volume-flow-rate-converter.texts.label-pints-per-second') },
  'pnt/min': { value: 'pints per minute', label: t('tools.volume-flow-rate-converter.texts.label-pints-per-minute') },
  'pnt/h': { value: 'pints per hour', label: t('tools.volume-flow-rate-converter.texts.label-pints-per-hour') },

  'qt/s': { value: 'quarts per second', label: t('tools.volume-flow-rate-converter.texts.label-quarts-per-second') },

  'gal/s': { value: 'gallons per second', label: t('tools.volume-flow-rate-converter.texts.label-gallons-per-second') },
  'gal/min': { value: 'gallons per minute', label: t('tools.volume-flow-rate-converter.texts.label-gallons-per-minute') },
  'gal/h': { value: 'gallons per hour', label: t('tools.volume-flow-rate-converter.texts.label-gallons-per-hour') },

  'ft3/s': { value: 'cubic feet per second', label: t('tools.volume-flow-rate-converter.texts.label-cubic-feet-per-second') },
  'ft3/min': { value: 'cubic feet per minute', label: t('tools.volume-flow-rate-converter.texts.label-cubic-feet-per-minute') },
  'ft3/h': { value: 'cubic feet per hour', label: t('tools.volume-flow-rate-converter.texts.label-cubic-feet-per-hour') },

  'yd3/s': { value: 'cubic yards per second', label: t('tools.volume-flow-rate-converter.texts.label-cubic-yards-per-second') },
  'yd3/min': { value: 'cubic yards per minute', label: t('tools.volume-flow-rate-converter.texts.label-cubic-yards-per-minute') },
  'yd3/h': { value: 'cubic yards per hour', label: t('tools.volume-flow-rate-converter.texts.label-cubic-yards-per-hour') },
};
</script>

<template>
  <UnitsConverter
    default-unit="l/s"
    converter-type="volumeFlowRate"
    :supported-units="supportedUnits"
    label-width="200px"
  />
</template>
