<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Exchange } from '@vicons/tabler';
import { isValidIpv4 } from '../ipv4-address-converter/ipv4-address-converter.service';
import type { Ipv4RangeExpanderResult } from './ipv4-range-expander.types';
import { calculateCidr } from './ipv4-range-expander.service';
import ResultRow from './result-row.vue';
import { useValidation } from '@/composable/validation';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const rawStartAddress = useQueryParamOrStorage({ name: 'start', storageName: 'ipv4-range-expander:startAddress', defaultValue: '192.168.1.1' });
const rawEndAddress = useQueryParamOrStorage({ name: 'end', storageName: 'ipv4-range-expander:endAddress', defaultValue: '192.168.6.255' });

const result = computed(() => calculateCidr({ startIp: rawStartAddress.value, endIp: rawEndAddress.value }));

const calculatedValues: {
  label: string
  getOldValue: (result: Ipv4RangeExpanderResult | undefined) => string | undefined
  getNewValue: (result: Ipv4RangeExpanderResult | undefined) => string | undefined
}[] = [
  {
    label: t('tools.ipv4-range-expander.texts.label-start-address'),
    getOldValue: () => rawStartAddress.value,
    getNewValue: result => result?.newStart,
  },
  {
    label: t('tools.ipv4-range-expander.texts.label-end-address'),
    getOldValue: () => rawEndAddress.value,
    getNewValue: result => result?.newEnd,
  },
  {
    label: t('tools.ipv4-range-expander.texts.label-addresses-in-range'),
    getOldValue: result => result?.oldSize?.toLocaleString(),
    getNewValue: result => result?.newSize?.toLocaleString(),
  },
  {
    label: t('tools.ipv4-range-expander.texts.label-cidr'),
    getOldValue: () => '',
    getNewValue: result => result?.newCidr,
  },
];

const startIpValidation = useValidation({
  source: rawStartAddress,
  rules: [{ message: t('tools.ipv4-range-expander.texts.message-invalid-ipv4-address'), validator: ip => isValidIpv4({ ip }) }],
});
const endIpValidation = useValidation({
  source: rawEndAddress,
  rules: [{ message: t('tools.ipv4-range-expander.texts.message-invalid-ipv4-address'), validator: ip => isValidIpv4({ ip }) }],
});

const showResult = computed(() => endIpValidation.isValid && startIpValidation.isValid && result.value !== undefined);

function onSwitchStartEndClicked() {
  const tmpStart = rawStartAddress.value;
  rawStartAddress.value = rawEndAddress.value;
  rawEndAddress.value = tmpStart;
}
</script>

<template>
  <div>
    <div mb-4 flex gap-4>
      <c-input-text
        v-model:value="rawStartAddress"
        :label="t('tools.ipv4-range-expander.texts.label-start-address')"
        :placeholder="t('tools.ipv4-range-expander.texts.placeholder-start-ipv4-address')"
        :validation="startIpValidation"
        clearable
      />

      <c-input-text
        v-model:value="rawEndAddress"
        :label="t('tools.ipv4-range-expander.texts.label-end-address')"
        :placeholder="t('tools.ipv4-range-expander.texts.placeholder-end-ipv4-address')"
        :validation="endIpValidation"
        clearable
      />
    </div>

    <n-table v-if="showResult" data-test-id="result">
      <thead>
        <tr>
          <th scope="col">
            {{ t('tools.ipv4-range-expander.texts.tag-nbsp') }}
          </th>
          <th scope="col">
            {{ t('tools.ipv4-range-expander.texts.tag-old-value') }}
          </th>
          <th scope="col">
            {{ t('tools.ipv4-range-expander.texts.tag-new-value') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <ResultRow
          v-for="{ label, getOldValue, getNewValue } in calculatedValues"
          :key="label"
          :label="label"
          :old-value="getOldValue(result)"
          :new-value="getNewValue(result)"
        />
      </tbody>
    </n-table>
    <n-alert
      v-else-if="startIpValidation.isValid && endIpValidation.isValid"
      :title="t('tools.ipv4-range-expander.texts.title-invalid-combination-of-start-and-end-ipv4-address')"
      type="error"
    >
      <div my-3 op-70>
        The end IPv4 address is lower than the start IPv4 address. This is not valid and no result could be calculated.
        In the most cases the solution to solve this problem is to change start and end address.
      </div>

      <c-button @click="onSwitchStartEndClicked">
        <n-icon mr-2 :component="Exchange" depth="3" size="22" />{{ t('tools.ipv4-range-expander.texts.tag-switch-start-and-end-ipv4-address') }}
      </c-button>
    </n-alert>
  </div>
</template>
