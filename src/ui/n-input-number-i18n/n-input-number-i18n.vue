<script setup lang="ts">
import { NInputNumber } from 'naive-ui';
import type { InputNumberProps } from 'naive-ui';
import { formatNumber, parseNumber } from './n-input-number-i18n.utils';

// workaround for compiler sfc failing to interprete InputNumberProps
interface InputNumberPropsI18N extends /** @vue-ignore */ InputNumberProps { }

const props = defineProps<InputNumberPropsI18N>();
</script>

<template>
  <NInputNumber v-bind="props" :parse="parseNumber" :format="formatNumber" />
</template>
