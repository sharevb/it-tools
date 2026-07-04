<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { mergeCidr, parseCidr } from 'cidr-tools';
import { isIP, isIPv6 } from 'is-ip';
import { Exchange } from '@vicons/tabler';
import { stringifyIp } from 'ip-bigint';
import { useValidation } from '@/composable/validation';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const rawStartAddress = useQueryParamOrStorage({ name: 'start', storageName: 'ip-range-to-cidr:startAddress', defaultValue: '192.168.1.1' });
const rawEndAddress = useQueryParamOrStorage({ name: 'end', storageName: 'ip-range-to-cidr:endAddress', defaultValue: '192.168.6.255' });

const isReversed = ref<boolean>(false);
const isNotSameVersion = ref<boolean>(false);

const result = computed(() => {
  try {
    isNotSameVersion.value = isIPv6(rawEndAddress.value) !== isIPv6(rawStartAddress.value);
    isReversed.value = false;
    if (isNotSameVersion.value) {
      return [];
    }

    const startIp = parseCidr(rawStartAddress.value).start;
    const endIp = parseCidr(rawEndAddress.value).end;
    isReversed.value = startIp > endIp;
    if (isReversed.value) {
      return [];
    }

    const version = isIPv6(rawStartAddress.value) ? 6 : 4;
    const ipRangeLength = endIp - startIp + 1n;
    const allIps = new BigInt64Array(Number(ipRangeLength));
    let iterIp = startIp;
    for (let i = 0; i < ipRangeLength; i++) {
      allIps[i] = iterIp++;
    }

    return mergeCidr(Array.from(allIps, ip => stringifyIp({ number: ip, version })));
  }
  catch (e) {
    return [];
  }
});

const startIpValidation = useValidation({
  source: rawStartAddress,
  rules: [{ message: t('tools.ip-range-to-cidr.texts.message-invalid-ipv4-6-address'), validator: ip => isIP(ip) }],
});
const endIpValidation = useValidation({
  source: rawEndAddress,
  rules: [{ message: t('tools.ip-range-to-cidr.texts.message-invalid-ipv4-6-address'), validator: ip => isIP(ip) }],
});

const showResult = computed(() => endIpValidation.isValid && startIpValidation.isValid && result.value.length > 0);

function onSwitchStartEndClicked() {
  const tmpStart = rawStartAddress.value;
  rawStartAddress.value = rawEndAddress.value;
  rawEndAddress.value = tmpStart;
}
</script>

<template>
  <div>
    <n-grid cols="4" x-gap="12" mb-6 w-full>
      <n-gi span="2">
        <c-input-text
          v-model:value="rawStartAddress"
          :label="t('tools.ip-range-to-cidr.texts.label-start-address')"
          :placeholder="t('tools.ip-range-to-cidr.texts.placeholder-start-ipv4-6-address')"
          :validation="startIpValidation"
          clearable
        />
      </n-gi>
      <n-gi span="2">
        <c-input-text
          v-model:value="rawEndAddress"
          :label="t('tools.ip-range-to-cidr.texts.label-end-address')"
          :placeholder="t('tools.ip-range-to-cidr.texts.placeholder-end-ipv4-6-address')"
          :validation="endIpValidation"
          clearable
        />
      </n-gi>
    </n-grid>

    <c-card v-if="showResult" :title="t('tools.ip-range-to-cidr.texts.title-cidr')" data-test-id="result">
      <ul style="list-item-type: none">
        <li v-for="cidr in result" :key="cidr">
          {{ cidr }}
        </li>
      </ul>
    </c-card>
    <n-alert
      v-else-if="startIpValidation.isValid && endIpValidation.isValid && isReversed"
      :title="t('tools.ip-range-to-cidr.texts.title-invalid-combination-of-start-and-end-ipv4-6-address')"
      type="error"
    >
      <div my-3 op-70>
        The end IPv4/6 address is lower than the start IPv4/6 address. This is not valid and no result could be calculated.
        In the most cases the solution to solve this problem is to change start and end address.
      </div>

      <c-button @click="onSwitchStartEndClicked">
        <n-icon mr-2 :component="Exchange" depth="3" size="22" />{{ t('tools.ip-range-to-cidr.texts.tag-switch-start-and-end-ipv4-6-address') }}
      </c-button>
    </n-alert>
    <n-alert
      v-else-if="isNotSameVersion"
      :title="t('tools.ip-range-to-cidr.texts.title-invalid-combination-of-ip-version-4-6')"
      type="error"
    >
      <div my-3 op-70>
        {{ t('tools.ip-range-to-cidr.texts.tag-start-ip-and-end-ip-must-be-of-same-version-ipv4-or-ipv6') }}
      </div>
    </n-alert>
  </div>
</template>
