<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Check as CheckIcon, LetterX as CrossIcon } from '@vicons/tabler';
import { getMatch } from 'ip-matching';
import { cidrInCidr } from './cidr-in-cidr.service';
import { withDefaultOnError } from '@/utils/defaults';
import { isNotThrowing } from '@/utils/boolean';
import SpanCopyable from '@/components/SpanCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const baseRange = useQueryParamOrStorage({ name: 'range', storageName: 'cidr-in-cidr:range', defaultValue: '192.168.0.1/24' }); // NOSONAR
const ipOrRangeToTest = useQueryParamOrStorage({ name: 'ip', storageName: 'cidr-in-cidr:ip', defaultValue: '192.168.0.1' }); // NOSONAR

const matchResult = computed(() => withDefaultOnError(
  () => cidrInCidr({ baseRange: baseRange.value, ipOrRangeToTest: ipOrRangeToTest.value }),
  { baseSubnets: [], isIncluded: false }));

const rangeValidationRules = [
  {
    message: t('tools.cidr-in-cidr.texts.message-we-cannot-parse-this-cidr-ip-range-mask-wildcard-check-the-format'),
    validator: (value: string) => isNotThrowing(() => getMatch(value)) && getMatch(value),
  },
];
</script>

<template>
  <div>
    <c-input-text
      v-model:value="baseRange"
      :label="t('tools.cidr-in-cidr.texts.label-an-ipv4-6-cidr-range-mask-wildcard-base-network')"
      :placeholder="t('tools.cidr-in-cidr.texts.placeholder-the-ipv4-6-cidr')"
      :validation-rules="rangeValidationRules"
      mb-4
    />

    <c-input-text
      v-model:value="ipOrRangeToTest"
      :label="t('tools.cidr-in-cidr.texts.label-an-ipv4-6-cidr-range-mask-wildcard-to-test-for-inclusion')"
      :placeholder="t('tools.cidr-in-cidr.texts.placeholder-the-an-ipv4-6-cidr-range-mask-wildcard')"
      :validation-rules="rangeValidationRules"
      mb-4
    />

    <n-divider />

    <div flex justify-center>
      <span v-if="matchResult.isIncluded">
        <n-icon color="green">
          <CheckIcon />
        </n-icon>{{ t('tools.cidr-in-cidr.texts.tag-included') }}</span>
      <span v-else>
        <n-icon color="red">
          <CrossIcon />
        </n-icon>{{ t('tools.cidr-in-cidr.texts.tag-not-included') }}</span>
    </div>

    <n-divider />

    <c-card :title="t('tools.cidr-in-cidr.texts.title-subnets')">
      <n-table>
        <tbody>
          <tr v-for="{ cidr, start, end } in matchResult.baseSubnets" :key="cidr">
            <td font-bold>
              <SpanCopyable :value="cidr" />
            </td>
            <td>
              <SpanCopyable :value="start" />
            </td>
            <td>
              <SpanCopyable :value="end" />
            </td>
          </tr>
        </tbody>
      </n-table>
    </c-card>
  </div>
</template>
