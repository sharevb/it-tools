<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { raidCalculations } from './raid-calculator.service';
import { UNIT_BASE, formatBytes } from '@/utils/convert';

const { t } = useI18n();

const diskTotal = ref(2);
const diskSize = ref(100);
const diskUnit = ref(10 ** 9);
const diskPerStripe = ref(3);
const raidType = ref('raid_0');
const raidInfo = computed(() => raidCalculations[raidType.value].about);
const raidRequirements = computed(() => raidCalculations[raidType.value].requirements);
const inputsValid = computed(() => validateSetup());

const totalStripes = computed(() => {
  if (inputsValid.value) {
    return `${diskTotal.value / diskPerStripe.value} stripes total`;
  }
  else {
    return '';
  }
});

const calculatedCapacity = computed(() => {
  return formatBytes(raidCalculations[raidType.value].capacity(diskTotal.value, diskSize.value, diskPerStripe.value, diskUnit.value), 2, UNIT_BASE.BASE_10);
});

const calculatedFaultTolerance = computed(() => {
  return raidCalculations[raidType.value].fault(diskTotal.value, diskSize.value, diskUnit.value);
});

const calculatedSpaceEfficiency = computed(() => {
  return raidCalculations[raidType.value].efficiency(diskTotal.value, diskPerStripe.value).toFixed(1);
});

function validateSetup() {
  // validate the selected RAID type against parameters
  return raidCalculations[raidType.value].validate(diskTotal.value, diskSize.value, diskPerStripe.value);
}
</script>

<template>
  <div>
    <c-card>
      <n-form-item :label="t('tools.raid-calculator.texts.label-number-of-disks')" label-placement="left" label-width="150" mb-2>
        <n-input-number v-model:value="diskTotal" max="10000" min="2" :placeholder="t('tools.raid-calculator.texts.placeholder-number-of-disks-ex-2')" w-full />
      </n-form-item>

      <n-form-item :label="t('tools.raid-calculator.texts.label-disk-size')" label-placement="left" label-width="150" mb-2>
        <n-input-number v-model:value="diskSize" max="10000" min="1" :placeholder="t('tools.raid-calculator.texts.placeholder-disk-size-ex-100')" w-full />
        <div flex items-baseline gap-2>
          <c-select
            v-model:value="diskUnit"

            ml-1 min-w-130px
            :options="[
              { label: t('tools.raid-calculator.texts.label-mb'), value: 10 ** 6 },
              { label: t('tools.raid-calculator.texts.label-gb'), value: 10 ** 9 },
              { label: t('tools.raid-calculator.texts.label-tb'), value: 10 ** 12 },
              { label: t('tools.raid-calculator.texts.label-pb'), value: 10 ** 15 },
            ]"
          />
        </div>
      </n-form-item>
      <n-form-item v-if="['raid_50', 'raid_60', 'raid_70'].includes(raidType)" :label="t('tools.raid-calculator.texts.label-disks-per-stripe')" label-placement="left" label-width="150" mb-2>
        <n-input-number v-model:value="diskPerStripe" max="10000" min="2" :placeholder="t('tools.raid-calculator.texts.placeholder-number-of-disks-per-stripe-ex-3')" w-full />
        <n-input v-model:value="totalStripes" placeholder="" readonly ml-1 w-full />
      </n-form-item>
      <n-form-item :label="t('tools.raid-calculator.texts.label-raid-type')" label-placement="left" label-width="150" mb-2>
        <c-select
          v-model:value="raidType"
          w-full
          :options="[
            { label: t('tools.raid-calculator.texts.label-raid-0-stripe'), value: 'raid_0' },
            { label: t('tools.raid-calculator.texts.label-raid-1-mirror'), value: 'raid_1' },
            { label: t('tools.raid-calculator.texts.label-raid-5-parity'), value: 'raid_5' },
            { label: t('tools.raid-calculator.texts.label-raid-6-double-parity'), value: 'raid_6' },
            { label: t('tools.raid-calculator.texts.label-raid-7-triple-parity'), value: 'raid_7' },
            { label: t('tools.raid-calculator.texts.label-raid-10-mirror-stripe'), value: 'raid_10' },
            { label: t('tools.raid-calculator.texts.label-raid-50-parity-stripe'), value: 'raid_50' },
            { label: t('tools.raid-calculator.texts.label-raid-60-double-parity-stripe'), value: 'raid_60' },
            { label: t('tools.raid-calculator.texts.label-raid-70-triple-parity-stripe'), value: 'raid_70' },
          ]"
        />
      </n-form-item>
      <p v-if="!inputsValid" class="raidError">
        {{ raidRequirements }}
      </p>
      <p>
        {{ raidInfo }}<br><br>{{ t('tools.raid-calculator.texts.tag-for-more-information-on-raid-types-see') }}<a href="https://en.wikipedia.org/wiki/Standard_RAID_levels" target="_blank" rel="noopener">{{ t('tools.raid-calculator.texts.tag-wikipedia') }}</a>{{ t('tools.raid-calculator.texts.tag-') }}
      </p>
    </c-card>
    <c-card :title="t('tools.raid-calculator.texts.title-results')">
      <n-table v-if="inputsValid">
        <tbody>
          <tr>
            <td font-bold width="30%">
              {{ t('tools.raid-calculator.texts.tag-capacity') }}
            </td>
            <td>
              {{ calculatedCapacity }}
            </td>
          </tr>
          <tr>
            <td font-bold width="30%">
              {{ t('tools.raid-calculator.texts.tag-fault-tolerance') }}
            </td>
            <td>
              {{ calculatedFaultTolerance }}
            </td>
          </tr>
          <tr>
            <td font-bold width="30%">
              {{ t('tools.raid-calculator.texts.tag-space-efficiency') }}
            </td>
            <td>
              {{ calculatedSpaceEfficiency }}%
            </td>
          </tr>
        </tbody>
      </n-table>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.raidError {
  color: rgb(208, 48, 80)
}
</style>
