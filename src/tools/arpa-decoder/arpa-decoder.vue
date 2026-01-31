<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { fromARPA } from '@/utils/ip';

const { t } = useI18n();

const arpaInput = ref('');

const decodedIP = computed(() => {
  try {
    return fromARPA(arpaInput.value.trim());
  }
  catch (e: any) {
    return `# ${e.toString()}`;
  }
});
</script>

<template>
  <div>
    <NFormItem :label="t('tools.arpa-decoder.texts.label-arpa-address')" label-placement="left" mb-2>
      <NInput v-model:value="arpaInput" :placeholder="t('tools.arpa-decoder.texts.placeholder-e-g-10-1-168-192-in-addr-arpa-or-xxxx-ip6-arpa')" />
    </NFormItem>

    <c-card v-if="decodedIP">
      <textarea-copyable :value="decodedIP" />
    </c-card>
  </div>
</template>
