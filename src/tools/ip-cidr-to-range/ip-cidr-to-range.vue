<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import isCidr from 'is-cidr';
import { expandCidr } from 'cidr-tools';
import { getIPNetworkType, parseAsCIDR } from '@/utils/ip';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const rawCIDR = useStorage('ip-cidr-to-range:cidr', '192.168.1.0/24'); // NOSONAR

const result = computed(() => {
  const parsedCIDR = parseAsCIDR(rawCIDR.value) || rawCIDR.value;
  const ips = [...expandCidr(parsedCIDR)];
  if (!ips || !ips.length) {
    return undefined;
  }

  return {
    startIpAddress: ips.slice(0, 1)[0],
    endIpAddress: ips.slice(-1)[0],
    parsedCIDR,
    networkType: getIPNetworkType(ips.slice(0, 1)[0]) || 'Public',
  };
});

const cidrValidation = useValidation({
  source: rawCIDR,
  rules: [{ message: t('tools.ip-cidr-to-range.texts.message-invalid-ipv4-6-cidr'), validator: cidr => isCidr(parseAsCIDR(cidr) || cidr) }],
});

const showResult = computed(() => cidrValidation.isValid && result.value !== undefined);
</script>

<template>
  <div>
    <c-input-text
      v-model:value="rawCIDR"
      :label="t('tools.ip-cidr-to-range.texts.label-ipv4-6-cidr-ie-1-0-0-0-23-or-1-1-1-1-255-255-252-0-or-1-1-1-1-2-2-2-2-or-10-0-0')"
      :placeholder="t('tools.ip-cidr-to-range.texts.placeholder-ipv4-6-cidr-ie-1-0-0-0-23-or-1-1-1-1-255-255-252-0-or-1-1-1-1-2-2-2-2-or-10-0-0')"
      :validation="cidrValidation"
      clearable
    />

    <c-card v-if="showResult" :title="t('tools.ip-cidr-to-range.texts.title-resulting-cidr')" mt-4>
      <input-copyable
        :label="t('tools.ip-cidr-to-range.texts.label-cidr')"
        label-position="left"
        label-width="150px"
        label-align="right"

        :value="result?.parsedCIDR"
        disabled mb-2
      />
    </c-card>

    <c-card v-if="showResult" :title="t('tools.ip-cidr-to-range.texts.title-ipv4-6-range')" mt-4>
      <input-copyable
        :label="t('tools.ip-cidr-to-range.texts.label-start-ip-address')"
        label-position="left"
        label-width="150px"
        label-align="right"

        :value="result?.startIpAddress"
        disabled mb-2
      />
      <input-copyable
        :label="t('tools.ip-cidr-to-range.texts.label-end-ip-address')"
        label-position="left"
        label-width="150px"
        label-align="right"

        :value="result?.endIpAddress"
        disabled mb-2
      />

      <input-copyable
        :label="t('tools.ip-cidr-to-range.texts.label-network-type')"
        label-position="left"
        label-width="150px"
        label-align="right"

        :value="result?.networkType"
        disabled mb-2
      />
    </c-card>
  </div>
</template>
