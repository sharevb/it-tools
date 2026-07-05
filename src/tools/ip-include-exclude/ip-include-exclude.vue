<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { substractCIDRs } from './ip-include-exclude.service';
import SpanCopyable from '@/components/SpanCopyable.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const allowedRanges = useQueryParamOrStorage({ name: 'allow', storageName: 'ip-inc-exc:allow', defaultValue: '192.168.0.1/24' }); // NOSONAR
const disallowedRanges = useQueryParamOrStorage({ name: 'disallow', storageName: 'ip-inc-exc:disallow', defaultValue: '192.168.0.6' }); // NOSONAR

const result = computed(() => substractCIDRs({
  allowedRanges: allowedRanges.value, disallowedRanges: disallowedRanges.value,
}));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="allowedRanges"
      :label="t('tools.ip-include-exclude.texts.label-allowedips-ipv4-6-cidr-range-mask-wildcard')"
      :placeholder="t('tools.ip-include-exclude.texts.placeholder-an-ipv4-6-cidr-range-mask-wildcard')"
      mb-4
    />

    <c-input-text
      v-model:value="disallowedRanges"
      :label="t('tools.ip-include-exclude.texts.label-disallowedips-ipv4-6-cidr-range-mask-wildcard')"
      :placeholder="t('tools.ip-include-exclude.texts.placeholder-an-ipv4-6-cidr-range-mask-wildcard')"
      mb-4
    />

    <n-divider />

    <c-alert v-if="result.error">
      {{ result.error }}
    </c-alert>

    <div v-if="!result.error">
      <n-form-item :label="t('tools.ip-include-exclude.texts.label-final-allowedips')">
        <TextareaCopyable :value="result.allowedCIDRs.join(', ')" />
      </n-form-item>

      <n-divider />

      <c-card :title="t('tools.ip-include-exclude.texts.title-allowed-subnets')">
        <n-table>
          <tbody>
            <tr v-for="{ cidr, start, end } in result.allowedSubnets" :key="cidr">
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
      <c-card :title="t('tools.ip-include-exclude.texts.title-disallowed-subnets')">
        <n-table>
          <tbody>
            <tr v-for="{ cidr, start, end } in result.disallowedSubnets" :key="cidr">
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
  </div>
</template>
