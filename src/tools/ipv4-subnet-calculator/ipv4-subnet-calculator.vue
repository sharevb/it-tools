<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Netmask } from 'netmask';
import { ArrowLeft, ArrowRight } from '@vicons/tabler';
import { getIPClass } from './ipv4-subnet-calculator.models';
import { withDefaultOnError } from '@/utils/defaults';
import { isNotThrowing } from '@/utils/boolean';
import SpanCopyable from '@/components/SpanCopyable.vue';
import { getIPNetworkType, getNetworksCount, getSubnets, parseAsCIDR, to6to4Prefix, toARPA, toIPv4MappedAddress, toIPv4MappedAddressDecimal } from '@/utils/ip';
import { useITStorage } from '@/composable/queryParams';

const { t } = useI18n();

const ip = useITStorage('ipv4-subnet-calculator:ip', '192.168.0.1/24');

const getNetworkInfo = (address: string) => new Netmask(parseAsCIDR(address.trim()) || address.trim());

const networkInfo = computed(() => withDefaultOnError(() => getNetworkInfo(ip.value), undefined));

const ipValidationRules = [
  {
    message: t('tools.ipv4-subnet-calculator.texts.message-we-cannot-parse-this-address-check-the-format'),
    validator: (value: string) => isNotThrowing(() => getNetworkInfo(value)),
  },
];

const sections: {
  label: string
  getValue: (blocks: Netmask) => string | undefined
  undefinedFallback?: string
}[] = [
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-netmask'),
    getValue: block => block.toString(),
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-network-address'),
    getValue: ({ base }) => base,
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-network-mask'),
    getValue: ({ mask }) => mask,
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-network-mask-in-binary'),
    getValue: ({ bitmask }) => ('1'.repeat(bitmask) + '0'.repeat(32 - bitmask)).match(/.{8}/g)?.join('.') ?? '',
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-cidr-notation'),
    getValue: ({ bitmask }) => `/${bitmask}`,
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-wildcard-mask'),
    getValue: ({ hostmask }) => hostmask,
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-network-size'),
    getValue: ({ size }) => String(size),
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-subnets-count'),
    getValue: ({ base: ip, bitmask }) => getNetworksCount(`${ip}/${bitmask}`)?.toString() || '',
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-subnets'),
    getValue: ({ base: ip, bitmask }) => getSubnets(`${ip}/${bitmask}`).join(', '),
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-first-address'),
    getValue: ({ first }) => first,
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-last-address'),
    getValue: ({ last }) => last,
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-broadcast-address'),
    getValue: ({ broadcast }) => broadcast,
    undefinedFallback: 'No broadcast address with this mask',
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-arpa'),
    getValue: ({ base: ip }) => toARPA(ip),
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-ipv4-mapped-address'),
    getValue: ({ base: ip }) => toIPv4MappedAddress(ip),
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-ipv4-mapped-address-decimal'),
    getValue: ({ base: ip }) => toIPv4MappedAddressDecimal(ip),
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-6to4-prefix'),
    getValue: ({ base: ip }) => to6to4Prefix(ip),
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-ip-class'),
    getValue: ({ base: ip }) => getIPClass({ ip }),
    undefinedFallback: 'Unknown class type',
  },
  {
    label: t('tools.ipv4-subnet-calculator.texts.label-type'),
    getValue: ({ base: ip }) => getIPNetworkType(ip),
  },
];

function switchToBlock({ count = 1 }: { count?: number }) {
  const next = networkInfo.value?.next(count);

  if (next) {
    ip.value = next.toString();
  }
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="ip"
      :label="t('tools.ipv4-subnet-calculator.texts.label-an-ipv4-address-with-or-without-mask-cidr-ip-range-wildcard-ip-ip-mask')"
      :placeholder="t('tools.ipv4-subnet-calculator.texts.placeholder-the-ipv4-address')"
      :validation-rules="ipValidationRules"
      mb-4
    />

    <div v-if="networkInfo">
      <n-table>
        <tbody>
          <tr v-for="{ getValue, label, undefinedFallback } in sections" :key="label">
            <td font-bold>
              {{ label }}
            </td>
            <td>
              <SpanCopyable v-if="getValue(networkInfo)" :value="getValue(networkInfo)" />
              <span v-else op-70>
                {{ undefinedFallback }}
              </span>
            </td>
          </tr>
        </tbody>
      </n-table>

      <div mt-3 flex items-center justify-between>
        <c-button @click="switchToBlock({ count: -1 })">
          <n-icon :component="ArrowLeft" />{{ t('tools.ipv4-subnet-calculator.texts.tag-previous-block') }}
        </c-button>
        <c-button @click="switchToBlock({ count: 1 })">
          {{ t('tools.ipv4-subnet-calculator.texts.tag-next-block') }}<n-icon :component="ArrowRight" />
        </c-button>
      </div>
    </div>
  </div>
</template>
