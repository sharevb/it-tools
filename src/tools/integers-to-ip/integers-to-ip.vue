<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { stringifyIp } from 'ip-bigint';
import InputCopyable from '../../components/InputCopyable.vue';
import { convertBase, hasNumberPrefix } from '../integer-base-converter/integer-base-converter.model';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const input = useQueryParam({ tool: 'int-to-ip', name: 'int', defaultValue: '3232235777' });
const inputBase = useQueryParam({ tool: 'int-to-ip', name: 'base', defaultValue: 10 });

const hasInputNumberPrefix = computed(() => hasNumberPrefix(input.value));

function convertToIP({ value, fromBase, version }: { value: string; fromBase: number; version: 6 | 4 }): string {
  try {
    return stringifyIp({
      number: BigInt(convertBase({
        value,
        fromBase,
        toBase: 10,
      })),
      version,
    }) ?? 'Invalid IP';
  }
  catch (err) {
    return err?.toString() ?? 'Invalid IP';
  }
}
</script>

<template>
  <div>
    <c-card>
      <c-input-text v-model:value="input" :label="t('tools.integers-to-ip.texts.label-input-number')" :placeholder="t('tools.integers-to-ip.texts.placeholder-put-your-number-here-ex-3232235777')" label-position="left" label-width="110px" mb-2 label-align="right" />

      <n-form-item v-if="!hasInputNumberPrefix" :label="t('tools.integers-to-ip.texts.label-input-base')" label-placement="left" label-width="110" :show-feedback="false">
        <c-select
          v-model:value="inputBase"
          :options="[{ value: 2, label: t('tools.integers-to-ip.texts.label-binary') }, { value: 8, label: t('tools.integers-to-ip.texts.label-octal') }, { value: 10, label: t('tools.integers-to-ip.texts.label-decimal') }, { value: 16, label: t('tools.integers-to-ip.texts.label-hexadecimal') }]"
          :placeholder="t('tools.integers-to-ip.texts.placeholder-select-a-base')"
          w-100px
        />
      </n-form-item>

      <n-divider />

      <InputCopyable
        :label="t('tools.integers-to-ip.texts.label-formatted-ipv4')"
        label-position="left" label-width="110px" mb-2 label-align="right"
        :value="convertToIP({ value: input, fromBase: inputBase, version: 4 })"
        :placeholder="t('tools.integers-to-ip.texts.placeholder-formatted-ipv4-will-be-here')"
      />

      <InputCopyable
        :label="t('tools.integers-to-ip.texts.label-formatted-ipv6')"
        label-position="left" label-width="110px" mb-2 label-align="right"
        :value="convertToIP({ value: input, fromBase: inputBase, version: 6 })"
        :placeholder="t('tools.integers-to-ip.texts.placeholder-formatted-ipv6-will-be-here')"
      />
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.n-input-group:not(:first-child) {
  margin-top: 5px;
}
</style>
