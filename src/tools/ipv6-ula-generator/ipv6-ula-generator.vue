<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SHA1 } from 'crypto-js';
import InputCopyable from '@/components/InputCopyable.vue';
import { macAddressValidation } from '@/utils/macAddress';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const macAddress = useQueryParam({ tool: 'ipv6-ula-gen', name: 'mac', defaultValue: '20:37:06:12:34:56' });
const calculatedSections = computed(() => {
  const timestamp = new Date().getTime();
  const hex40bit = SHA1(timestamp + macAddress.value)
    .toString()
    .substring(30);

  const ula = `fd${hex40bit.substring(0, 2)}:${hex40bit.substring(2, 6)}:${hex40bit.substring(6)}`;

  return [
    {
      label: t('tools.ipv6-ula-generator.texts.label-ipv6-ula'),
      value: `${ula}::/48`,
    },
    {
      label: t('tools.ipv6-ula-generator.texts.label-first-routable-block'),
      value: `${ula}:0::/64`,
    },
    {
      label: t('tools.ipv6-ula-generator.texts.label-last-routable-block'),
      value: `${ula}:ffff::/64`,
    },
  ];
});

const addressValidation = macAddressValidation(macAddress);
</script>

<template>
  <div>
    <n-alert :title="t('tools.ipv6-ula-generator.texts.title-info')" type="info">
      This tool uses the first method suggested by IETF using the current timestamp plus the mac address, sha1 hashed,
      and the lower 40 bits to generate your random ULA.
    </n-alert>

    <c-input-text
      v-model:value="macAddress"
      :placeholder="t('tools.ipv6-ula-generator.texts.placeholder-type-a-mac-address')"
      clearable
      :label="t('tools.ipv6-ula-generator.texts.label-mac-address')"
      raw-text
      my-8
      :validation="addressValidation"
    />

    <div v-if="addressValidation.isValid">
      <InputCopyable
        v-for="{ label, value } in calculatedSections"
        :key="label"
        :value="value"
        :label="label"
        label-width="160px"
        label-align="right"
        label-position="left"
        readonly
        mb-2
      />
    </div>
  </div>
</template>
