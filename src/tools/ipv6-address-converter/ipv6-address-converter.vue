<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { isIPv6 } from 'is-ip';
import { parseCidr } from 'cidr-tools';
import { stringifyIp } from 'ip-bigint';
import { convertBase } from '../integer-base-converter/integer-base-converter.model';
import { getIPNetworkType, toARPA, toMicrosoftTranscription } from '@/utils/ip';
import { useValidation } from '@/composable/validation';
import { useITStorage } from '@/composable/queryParams';

const { t } = useI18n();

const rawIpAddress = useITStorage('ipv6-converter:ip', '2001:db8:0:85a3::ac1f:8001'); // NOSONAR

const convertedSections = computed(() => {
  try {
    const parsedIPv6 = parseCidr(rawIpAddress.value);
    const ipInDecimal = parsedIPv6.start;

    return [
      {
        label: t('tools.ipv6-address-converter.texts.label-decimal'),
        value: String(ipInDecimal),
      },
      {
        label: t('tools.ipv6-address-converter.texts.label-hexadecimal'),
        value: convertBase({ fromBase: 10, toBase: 16, value: String(ipInDecimal) }).toUpperCase(),
      },
      {
        label: t('tools.ipv6-address-converter.texts.label-binary'),
        value: convertBase({ fromBase: 10, toBase: 2, value: String(ipInDecimal) }),
      },
      {
        label: t('tools.ipv6-address-converter.texts.label-cidr'),
        value: parsedIPv6.cidr,
      },
      {
        label: t('tools.ipv6-address-converter.texts.label-ipv6-short'),
        value: stringifyIp({ number: ipInDecimal, version: 6 }, { compress: true }),
      },
      {
        label: t('tools.ipv6-address-converter.texts.label-ipv6-long'),
        value: stringifyIp({ number: ipInDecimal, version: 6 }, { compress: false }),
      },
      {
        label: t('tools.ipv6-address-converter.texts.label-arpa'),
        value: toARPA(parsedIPv6.ip),
      },
      {
        label: t('tools.ipv6-address-converter.texts.label-microsoft-transcription'),
        value: toMicrosoftTranscription(parsedIPv6.ip),
      },
      {
        label: t('tools.ipv6-address-converter.texts.label-type'),
        value: getIPNetworkType(parsedIPv6.ip),
      },
    ];
  }
  catch (e) {
    return [];
  }
});

const { attrs: validationAttrs } = useValidation({
  source: rawIpAddress,
  rules: [{ message: t('tools.ipv6-address-converter.texts.message-invalid-ipv6-address'), validator: ip => isIPv6(ip) }],
});
</script>

<template>
  <div>
    <c-input-text v-model:value="rawIpAddress" :label="t('tools.ipv6-address-converter.texts.label-the-ipv6-address')" :placeholder="t('tools.ipv6-address-converter.texts.placeholder-the-ipv6-address')" />

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
      :placeholder="t('tools.ipv6-address-converter.texts.placeholder-set-a-correct-ipv6-address')"
    />
  </div>
</template>
