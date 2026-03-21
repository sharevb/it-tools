<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import InputCopyable from '../../components/InputCopyable.vue';
import { useQueryParam } from '@/composable/queryParams';
import type { Units } from './hdd-calculator.service';
import { fromBytes, toBytes } from './hdd-calculator.service';

const { t } = useI18n();

const units: Units[] = ['kb', 'mb', 'gb', 'tb', 'pb'];

const labelsDec: Record<string, string> = {
  kb: t('tools.hdd-calculator.texts.label-kb'),
  mb: t('tools.hdd-calculator.texts.label-mb'),
  gb: t('tools.hdd-calculator.texts.label-gb'),
  tb: t('tools.hdd-calculator.texts.label-tb'),
  pb: t('tools.hdd-calculator.texts.label-pb'),
};

const labelsBin: Record<string, string> = {
  kb: t('tools.hdd-calculator.texts.label-kib'),
  mb: t('tools.hdd-calculator.texts.label-mib'),
  gb: t('tools.hdd-calculator.texts.label-gib'),
  tb: t('tools.hdd-calculator.texts.label-tib'),
  pb: t('tools.hdd-calculator.texts.label-pib'),
};

const claimedCapacity = useQueryParam({ tool: 'hdd-calc', name: 'capacity', defaultValue: 1 });
const claimedUnit = useQueryParam({ tool: 'hdd-calc', name: 'unit', defaultValue: 'tb' });

const totalBytes = ref(toBytes(claimedCapacity.value, claimedUnit.value as Units, 'dec'));

function updateBytes(val: string | number | null, unit: Units, type: 'dec' | 'bin') {
  if (val === null || val === '') {
    return;
  }
  const numericVal = Number(val);
  if (Number.isNaN(numericVal)) {
    return;
  }

  totalBytes.value = toBytes(numericVal, unit, type);

  // Sync with query params for the default unit (e.g. 1 TB decimal)
  if (type === 'dec' && unit === 'tb') {
    claimedCapacity.value = numericVal;
  }
}
</script>

<template>
  <div>
    <n-p>
      {{ t('tools.hdd-calculator.texts.tag-1mib-1024kib-1mb-1000kb-1gib-1024mib-1gb-1000mb') }}<n-a href="https://en.wikipedia.org/wiki/Byte" target="_blank" rel="noopener">
        {{ t('tools.hdd-calculator.texts.tag-see-here-for-details') }}
      </n-a>
    </n-p>

    <n-divider />

    <n-table :single-line="false" class="hdd-calculator">
      <thead>
        <tr>
          <th>{{ t('tools.hdd-calculator.texts.column-decimal') }}</th>
          <th>{{ t('tools.hdd-calculator.texts.column-binary') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unit in units" :key="unit">
          <td>
            <n-form-item :label="labelsDec[unit]" :show-feedback="false">
              <InputCopyable
                :value="Number(fromBytes(totalBytes, unit, 'dec').toFixed(5)).toString()"
                type="number"
                @update:value="(val) => updateBytes(val, unit, 'dec')"
              />
            </n-form-item>
          </td>
          <td>
            <n-form-item :label="labelsBin[unit]" :show-feedback="false">
              <InputCopyable
                :value="Number(fromBytes(totalBytes, unit, 'bin').toFixed(5)).toString()"
                type="number"
                @update:value="(val) => updateBytes(val, unit, 'bin')"
              />
            </n-form-item>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<style scoped>
.hdd-calculator {
  max-width: 380px;
  margin: 0 auto;
}
</style>
