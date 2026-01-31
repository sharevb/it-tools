<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { toARPA } from '@/utils/ip';

const { t } = useI18n();

const ipInput = ref('');
const ptrRecord = computed(() => {
  try {
    return toARPA(ipInput.value.trim());
  }
  catch (e: any) {
    return `# ${e.toString()}`;
  }
});
</script>

<template>
  <div>
    <NFormItem :label="t('tools.ptr-dns-generator.texts.label-ip-address-ipv4-or-ipv6')" label-placement="left" mb-2>
      <NInput v-model:value="ipInput" :placeholder="t('tools.ptr-dns-generator.texts.placeholder-e-g-192-168-1-10-or-2001-db8-1')" />
    </NFormItem>

    <c-card v-if="ptrRecord">
      <textarea-copyable :value="ptrRecord" />
    </c-card>
  </div>
</template>
