<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { generateUlaBlocks } from './ipv6-ula-generator.service';
import InputCopyable from '@/components/InputCopyable.vue';
import { macAddressValidation } from '@/utils/macAddress';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const macAddress = useQueryParam({ tool: 'ipv6-ula-gen', name: 'mac', defaultValue: '20:37:06:12:34:56' });
const calculatedSections = computed(() => {
  const { ula, firstRoutableBlock, lastRoutableBlock } = generateUlaBlocks({
    macAddress: macAddress.value,
    timestamp: new Date().getTime(),
  });

  return [
    {
      label: t('tools.ipv6-ula-generator.texts.label-ipv6-ula'),
      value: ula,
    },
    {
      label: t('tools.ipv6-ula-generator.texts.label-first-routable-block'),
      value: firstRoutableBlock,
    },
    {
      label: t('tools.ipv6-ula-generator.texts.label-last-routable-block'),
      value: lastRoutableBlock,
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
