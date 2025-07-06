<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { getOption43Infos } from './option43-generator.service';

const { t } = useI18n();

const dhcpVendorOptions = [
  { value: 'genuine', label: t('tools.option43-generator.texts.label-native') },
  { value: 'cisco_01', label: t('tools.option43-generator.texts.label-cisco-ios-device') },
  { value: 'juniper_01', label: t('tools.option43-generator.texts.label-juniper-ex-device') },
  { value: 'juniper_02', label: t('tools.option43-generator.texts.label-juniper-srx-device') },
  { value: 'linux_01', label: t('tools.option43-generator.texts.label-linux-dhcpd') },
  { value: 'ruckus_01', label: t('tools.option43-generator.texts.label-ruckus-smartcellgateway') },
  { value: 'lancom_01', label: t('tools.option43-generator.texts.label-lancom') },
  { value: 'fortinet_01', label: t('tools.option43-generator.texts.label-fortinet') },
];
const wifiVendorOptions = [
  { value: 'cisco_01', label: t('tools.option43-generator.texts.label-cisco-aironet') },
  { value: 'aruba_01', label: t('tools.option43-generator.texts.label-aruba') },
  { value: 'ruckus_01', label: t('tools.option43-generator.texts.label-ruckus-smartzone') },
  { value: 'ruckus_02', label: t('tools.option43-generator.texts.label-ruckus-zonedirector') },
  { value: 'ruckus_01', label: t('tools.option43-generator.texts.label-ruckus-smartcellgateway') },
  { value: 'ubiquiti_01', label: t('tools.option43-generator.texts.label-ubiquiti') },
  { value: 'fortinet_01', label: t('tools.option43-generator.texts.label-fortinet-old') },
  { value: 'fortinet_02', label: t('tools.option43-generator.texts.label-fortinet-new-capwap') },
  { value: 'netgear_01', label: t('tools.option43-generator.texts.label-netgear') },
  { value: 'cambium_01', label: t('tools.option43-generator.texts.label-cambium-cnmaestro') },
];

const dhcpVendor = useStorage('option43-generator:dhcp', 'genuine');
const wifiVendor = useStorage('option43-generator:wifi', 'cisco_01');
const ipAdresses = ref('192.168.0.15'); // NOSONAR

const option43Infos = computed(() => getOption43Infos(ipAdresses.value, wifiVendor.value, dhcpVendor.value));
</script>

<template>
  <div style="margin: 0 auto;">
    <c-card>
      <c-select
        v-model:value="wifiVendor"
        :label="t('tools.option43-generator.texts.label-wifi-vendor')"
        label-position="left"
        label-width="120px"
        label-align="right"
        mb-2
        :options="wifiVendorOptions"
        w-full
        :placeholder="t('tools.option43-generator.texts.placeholder-select-a-wifi-vendor')"
      />

      <c-select
        v-model:value="dhcpVendor"
        :label="t('tools.option43-generator.texts.label-dhcp-vendor')"
        label-position="left"
        label-width="120px"
        label-align="right"
        mb-2
        :options="dhcpVendorOptions"
        w-full
        :placeholder="t('tools.option43-generator.texts.placeholder-select-a-dhcp-vendor')"
      />

      <c-input-text
        v-model:value="ipAdresses"
        :label="t('tools.option43-generator.texts.label-ip-address-es-one-per-line')"
        label-position="left"
        label-width="120px"
        label-align="right"
        multiline mb-2
        :placeholder="t('tools.option43-generator.texts.placeholder-enter-your-ip-addresses-one-per-line')"
      />
    </c-card>

    <c-card :title="t('tools.option43-generator.texts.title-option-43-result')">
      <!-- //NOSONAR --><div v-html="option43Infos" />
    </c-card>
  </div>
</template>

<style lang="less">
.highlight {
  color: orange;
  font-variant: small-caps;
}
.cli {
  background-color: black;
  color: #adfc03;
  font-family: monospace;
  padding: 10px;
  font-size: 13px;
}
</style>
