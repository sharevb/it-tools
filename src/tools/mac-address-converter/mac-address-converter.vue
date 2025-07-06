<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import InputCopyable from '../../components/InputCopyable.vue';
import {
  convertMacCISCO, convertMacCanonical,
  convertMacCanonicalIEEE, convertMacCanonicalIETF,
  convertMacToEUI64CISCO, convertMacToEUI64CanonicalIEEE,
  convertMacToEUI64CanonicalIETF, convertMacToLinkLocalIPv6,
  convertMacToNumber,
} from './mac-address-converter.service';

const { t } = useI18n();

const input = ref('AA:BB:CC:DD:EE:FF');

const formats = computed(() => [
  {
    label: t('tools.mac-address-converter.texts.label-canonical-ietf-format'),
    value: convertMacCanonicalIETF(input.value),
  },
  {
    label: t('tools.mac-address-converter.texts.label-canonical-format'),
    value: convertMacCanonical(input.value),
  },
  {
    label: t('tools.mac-address-converter.texts.label-canonical-ieee-format'),
    value: convertMacCanonicalIEEE(input.value),
  },
  {
    label: t('tools.mac-address-converter.texts.label-cisco'),
    value: convertMacCISCO(input.value),
  },
  {
    label: t('tools.mac-address-converter.texts.label-hex'),
    value: convertMacToNumber(input.value).toString(16),
  },
  {
    label: t('tools.mac-address-converter.texts.label-decimal'),
    value: convertMacToNumber(input.value).toString(10),
  },
  {
    label: t('tools.mac-address-converter.texts.label-eui-64-canonical-ietf-format'),
    value: convertMacToEUI64CanonicalIETF(input.value, false),
  },
  {
    label: t('tools.mac-address-converter.texts.label-eui-64-canonical-ieee-format'),
    value: convertMacToEUI64CanonicalIEEE(input.value, false),
  },
  {
    label: t('tools.mac-address-converter.texts.label-eui-64-cisco'),
    value: convertMacToEUI64CISCO(input.value, false),
  },
  {
    label: t('tools.mac-address-converter.texts.label-eui-64-ipv6-canonical-ietf-format'),
    value: convertMacToEUI64CanonicalIETF(input.value, true),
  },
  {
    label: t('tools.mac-address-converter.texts.label-eui-64-ipv6-canonical-ieee-format'),
    value: convertMacToEUI64CanonicalIEEE(input.value, true),
  },
  {
    label: t('tools.mac-address-converter.texts.label-eui-64-ipv6-cisco'),
    value: convertMacToEUI64CISCO(input.value, true),
  },
  {
    label: t('tools.mac-address-converter.texts.label-link-local-ipv6'),
    value: convertMacToLinkLocalIPv6(input.value),
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
      :placeholder="t('tools.mac-address-converter.texts.placeholder-type-a-mac-address')"
      clearable
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
      mb-1
    />
  </c-card>
</template>
