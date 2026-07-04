<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { convertBase } from '../integer-base-converter/integer-base-converter.model';
import { getIPClass } from '../ipv4-subnet-calculator/ipv4-subnet-calculator.models';
import { ipv4ToInt, ipv4ToIpv6, isValidIpv4 } from './ipv4-address-converter.service';
import { getIPNetworkType, to6to4Prefix, toARPA, toIPv4MappedAddressDecimal } from '@/utils/ip';
import { useValidation } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const rawIpAddress = useQueryParamOrStorage({ name: 'ip', storageName: 'ipv4-converter:ip', defaultValue: '192.168.1.1' }); // NOSONAR

const convertedSections = computed(() => withDefaultOnError(() => {
  const ipInDecimal = ipv4ToInt({ ip: rawIpAddress.value });

  return [
    {
      label: t('tools.ipv4-address-converter.texts.label-decimal'),
      value: String(ipInDecimal),
    },
    {
      label: t('tools.ipv4-address-converter.texts.label-hexadecimal'),
      value: convertBase({ fromBase: 10, toBase: 16, value: String(ipInDecimal) }).toUpperCase(),
    },
    {
      label: t('tools.ipv4-address-converter.texts.label-binary'),
      value: convertBase({ fromBase: 10, toBase: 2, value: String(ipInDecimal) }),
    },
    {
      label: t('tools.ipv4-address-converter.texts.label-ipv6'),
      value: ipv4ToIpv6({ ip: rawIpAddress.value }),
    },
    {
      label: t('tools.ipv4-address-converter.texts.label-ipv6-short'),
      value: ipv4ToIpv6({ ip: rawIpAddress.value, prefix: '::ffff:' }),
    },
    {
      label: t('tools.ipv4-address-converter.texts.label-ipv6-decimal'),
      value: toIPv4MappedAddressDecimal(rawIpAddress.value),
    },
    {
      label: t('tools.ipv4-address-converter.texts.label-6to4-prefix'),
      value: to6to4Prefix(rawIpAddress.value),
    },
    {
      label: t('tools.ipv4-address-converter.texts.label-cidr-notation'),
      value: `${rawIpAddress.value}/32`,
    },
    {
      label: t('tools.ipv4-address-converter.texts.label-arpa'),
      value: toARPA(rawIpAddress.value),
    },
    {
      label: t('tools.ipv4-address-converter.texts.label-ip-class'),
      value: getIPClass({ ip: rawIpAddress.value }),
    },
    {
      label: t('tools.ipv4-address-converter.texts.label-type'),
      value: getIPNetworkType(rawIpAddress.value),
    },
  ];
}, []));

const { attrs: validationAttrs } = useValidation({
  source: rawIpAddress,
  rules: [{ message: t('tools.ipv4-address-converter.texts.message-invalid-ipv4-address'), validator: ip => isValidIpv4({ ip }) }],
});
</script>

<template>
  <div>
    <c-input-text v-model:value="rawIpAddress" :label="t('tools.ipv4-address-converter.texts.label-the-ipv4-address')" :placeholder="t('tools.ipv4-address-converter.texts.placeholder-the-ipv4-address')" />

    <n-divider />

    <input-copyable
      v-for="{ label, value } of convertedSections"
      :key="label"
      :label="label"
      label-position="left"
      label-width="100px"
      label-align="right"
      mb-2
      :value="validationAttrs.validationStatus === 'error' ? '' : value"
      :placeholder="t('tools.ipv4-address-converter.texts.placeholder-set-a-correct-ipv4-address')"
    />
  </div>
</template>
