<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import { generateRandomMacAddress } from './mac-adress-generator.models';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { usePartialMacAddressValidation } from '@/utils/macAddress';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const amount = useQueryParamOrStorage({ name: 'amount', storageName: 'mac-address-generator:amount', defaultValue: 1 });
const macAddressPrefix = useQueryParamOrStorage({ name: 'prefix', storageName: 'mac-address-generator:prefix', defaultValue: '64:16:7F' });

const prefixValidation = usePartialMacAddressValidation(macAddressPrefix);

const casesTransformers = [
  { label: t('tools.mac-address-generator.texts.label-uppercase'), value: (value: string) => value.toUpperCase() },
  { label: t('tools.mac-address-generator.texts.label-lowercase'), value: (value: string) => value.toLowerCase() },
];
const caseTransformer = ref(casesTransformers[0].value);

const separators = [
  {
    label: t('tools.mac-address-generator.texts.label-'),
    value: ':',
  },
  {
    label: t('tools.mac-address-generator.texts.label-'),
    value: '-',
  },
  {
    label: t('tools.mac-address-generator.texts.label-'),
    value: '.',
  },
  {
    label: t('tools.mac-address-generator.texts.label-none'),
    value: '',
  },
];
const separator = useQueryParamOrStorage({ name: 'sep', storageName: 'mac-address-generator:separator', defaultValue: separators[0].value });

const [macAddresses, refreshMacAddresses] = computedRefreshable(() => {
  if (!prefixValidation.isValid) {
    return '';
  }

  const ids = _.times(amount.value, () => caseTransformer.value(generateRandomMacAddress({
    prefix: macAddressPrefix.value,
    separator: separator.value,
  })));
  return ids.join('\n');
});

const { copy } = useCopy({ source: macAddresses, text: t('tools.mac-address-generator.texts.text-mac-addresses-copied-to-the-clipboard') });
</script>

<template>
  <div flex flex-col justify-center gap-2>
    <div flex items-center>
      <label w-150px pr-12px text-right>{{ t('tools.mac-address-generator.texts.tag-quantity') }}</label>
      <n-input-number-i18n v-model:value="amount" min="1" max="100" flex-1 />
    </div>

    <c-input-text
      v-model:value="macAddressPrefix"
      :label="t('tools.mac-address-generator.texts.label-mac-address-prefix')"
      :placeholder="t('tools.mac-address-generator.texts.placeholder-set-a-prefix-e-g-64-16-7f')"
      clearable
      label-position="left"
      spellcheck="false"
      :validation="prefixValidation"
      raw-text
      label-width="150px"
      label-align="right"
    />

    <c-buttons-select
      v-model:value="caseTransformer"
      :options="casesTransformers"
      :label="t('tools.mac-address-generator.texts.label-case')"
      label-width="150px"
      label-align="right"
    />

    <c-buttons-select
      v-model:value="separator"
      :options="separators"
      :label="t('tools.mac-address-generator.texts.label-separator')"
      label-width="150px"
      label-align="right"
    />

    <c-card mt-5 flex data-test-id="ulids">
      <pre m-0 m-x-auto>{{ macAddresses }}</pre>
    </c-card>

    <div flex justify-center gap-2>
      <c-button data-test-id="refresh" @click="refreshMacAddresses()">
        {{ t('tools.mac-address-generator.texts.tag-refresh') }}
      </c-button>
      <c-button @click="copy()">
        {{ t('tools.mac-address-generator.texts.tag-copy') }}
      </c-button>
    </div>
  </div>
</template>
