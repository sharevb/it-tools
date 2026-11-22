<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import InputCopyable from '../../components/InputCopyable.vue';
import {
  convertMacCISCO,
  convertMacCanonical,
  convertMacCanonicalIEEE,
  convertMacCanonicalIETF,
  convertMacToEUI64CISCO,
  convertMacToEUI64CanonicalIEEE,
  convertMacToEUI64CanonicalIETF,
  convertMacToLinkLocalIPv6,
  convertMacToNumber,
} from './mac-address-converter.service';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const input = useQueryParam({ tool: 'mac-conv', name: 'addr', defaultValue: 'AA:BB:CC:DD:EE:FF' });

const convertMulti = (value: string, converter: (mac: string) => string): string => {
  const macs = value.split(/[\s,;]+/).filter((mac) => mac.trim() !== '');
  return macs
    .map((mac) => {
      try {
        return converter(mac);
      } catch (error) {
        return t('tools.mac-address-converter.texts.error-invalid-mac-address', [mac]);
      }
    })
    .join('\n');
};

const formats = computed(() => [
  {
    label: t('tools.mac-address-converter.texts.label-canonical-ietf-format'),
    value: convertMulti(input.value, convertMacCanonicalIETF),
  },
  {
    label: t('tools.mac-address-converter.texts.label-canonical-format'),
    value: convertMulti(input.value, convertMacCanonical),
  },
  {
    label: t('tools.mac-address-converter.texts.label-canonical-ieee-format'),
    value: convertMulti(input.value, convertMacCanonicalIEEE),
  },
  {
    label: t('tools.mac-address-converter.texts.label-cisco'),
    value: convertMulti(input.value, convertMacCISCO),
  },
  {
    label: t('tools.mac-address-converter.texts.label-hex'),
    value: convertMulti(input.value, (mac) => convertMacToNumber(mac).toString(16)),
  },
  {
    label: t('tools.mac-address-converter.texts.label-decimal'),
    value: convertMulti(input.value, (mac) => convertMacToNumber(mac).toString(10)),
  },
  {
    label: t('tools.mac-address-converter.texts.label-eui-64-canonical-ietf-format'),
    value: convertMulti(input.value, (mac) => convertMacToEUI64CanonicalIETF(mac, false)),
  },
  {
    label: t('tools.mac-address-converter.texts.label-eui-64-canonical-ieee-format'),
    value: convertMulti(input.value, (mac) => convertMacToEUI64CanonicalIEEE(mac, false)),
  },
  {
    label: t('tools.mac-address-converter.texts.label-eui-64-cisco'),
    value: convertMulti(input.value, (mac) => convertMacToEUI64CISCO(mac, false)),
  },
  {
    label: t('tools.mac-address-converter.texts.label-eui-64-ipv6-canonical-ietf-format'),
    value: convertMulti(input.value, (mac) => convertMacToEUI64CanonicalIETF(mac, true)),
  },
  {
    label: t('tools.mac-address-converter.texts.label-eui-64-ipv6-canonical-ieee-format'),
    value: convertMulti(input.value, (mac) => convertMacToEUI64CanonicalIEEE(mac, true)),
  },
  {
    label: t('tools.mac-address-converter.texts.label-eui-64-ipv6-cisco'),
    value: convertMulti(input.value, (mac) => convertMacToEUI64CISCO(mac, true)),
  },
  {
    label: t('tools.mac-address-converter.texts.label-link-local-ipv6'),
    value: convertMulti(input.value, (mac) => convertMacToLinkLocalIPv6(mac)),
  },
]);

const inputLabelAlignmentConfig = {
  labelPosition: 'left',
  labelWidth: '120px',
  labelAlign: 'right',
};
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="input"
      :label="t('tools.mac-address-converter.texts.label-mac-address')"
      size="large"
      :placeholder="t('tools.mac-address-converter.texts.placeholder-type-mac-address')"
      clearable
      multiline
      rows="3"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      mb-5
    />

    <div my-16px divider />

    <InputCopyable
      v-for="format in formats"
      :key="format.label"
      :value="format.value"
      :label="format.label"
      v-bind="inputLabelAlignmentConfig"
      multiline
      autosize
      rows="1"
      mb-1
    />
  </c-card>
</template>
