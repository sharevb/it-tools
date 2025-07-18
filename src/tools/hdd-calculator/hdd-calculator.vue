<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import InputCopyable from '../../components/InputCopyable.vue';
import type { Units } from './hdd-calculator.service';
import { getRealSize } from './hdd-calculator.service';

const { t } = useI18n();

const dec_units = [
  { value: 'kb', label: t('tools.hdd-calculator.texts.label-kb') },
  { value: 'mb', label: t('tools.hdd-calculator.texts.label-mb') },
  { value: 'gb', label: t('tools.hdd-calculator.texts.label-gb') },
  { value: 'tb', label: t('tools.hdd-calculator.texts.label-tb') },
  { value: 'pb', label: t('tools.hdd-calculator.texts.label-pb') },
];
const bin_units = [
  { value: 'kb', label: t('tools.hdd-calculator.texts.label-kib') },
  { value: 'mb', label: t('tools.hdd-calculator.texts.label-mib') },
  { value: 'gb', label: t('tools.hdd-calculator.texts.label-gib') },
  { value: 'tb', label: t('tools.hdd-calculator.texts.label-tib') },
  { value: 'pb', label: t('tools.hdd-calculator.texts.label-pib') },
];

const claimedCapacity = ref(1);
const claimedUnit = ref('tb');
</script>

<template>
  <div>
    <n-form-item :label="t('tools.hdd-calculator.texts.label-claimed-capacity')">
      <n-input-number v-model:value="claimedCapacity" :min="1" />
    </n-form-item>
    <c-select
      v-model:value="claimedUnit"
      :label="t('tools.hdd-calculator.texts.label-unit')"
      :options="dec_units"
    />
    <n-p>
      {{ t('tools.hdd-calculator.texts.tag-1mib-1024kib-1mb-1000kb-1gib-1024mib-1gb-1000mb') }}<n-a href="https://en.wikipedia.org/wiki/Byte" target="_blank" rel="noopener">
        {{ t('tools.hdd-calculator.texts.tag-see-here-for-details') }}
      </n-a>
    </n-p>

    <n-divider />

    <InputCopyable
      v-for="({ value, label }) in bin_units"
      :key="value"
      :label="`Capacity in ${label}:`"
      :value="getRealSize(claimedCapacity, claimedUnit as Units, value as Units).toFixed(5)"
    />
  </div>
</template>
