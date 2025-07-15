<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ports from 'port-numbers';
import SpanCopyable from '@/components/SpanCopyable.vue';

const { t } = useI18n();

const port = ref(80);
const protocol = ref('tcp');
const result = computed(() => {
  const [type, description] = ports[`${port.value}/${protocol.value}` as (keyof typeof ports)];
  return { type: type ?? 'unknown', description: description ?? 'Unknown' };
});
</script>

<template>
  <div>
    <c-card :title="t('tools.port-numbers.texts.title-port-search')">
      <n-space>
        <n-form-item :label="t('tools.port-numbers.texts.label-port-number')">
          <n-input-number v-model:value="port" :min="1" />
        </n-form-item>
        <n-form-item :label="t('tools.port-numbers.texts.label-protocol')">
          <c-select
            v-model:value="protocol"
            :options="[{ value: 'tcp', label: t('tools.port-numbers.texts.label-tcp') }, { value: 'udp', label: t('tools.port-numbers.texts.label-udp') }]"
          />
        </n-form-item>
      </n-space>
    </c-card>

    <c-card>
      <n-form-item :label="t('tools.port-numbers.texts.label-type')">
        <SpanCopyable :value="result?.type" />
      </n-form-item>
      <n-form-item :label="t('tools.port-numbers.texts.label-description')">
        <SpanCopyable :value="result?.description" />
      </n-form-item>
    </c-card>
  </div>
</template>
