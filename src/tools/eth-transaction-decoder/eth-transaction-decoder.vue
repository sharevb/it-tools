<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { decodeTransaction } from './eth-transaction-decoder.service';

const { t } = useI18n();

const abi = ref('');
const txJson = ref('');
const error = ref('');
const decoded = computed(() => {
  error.value = '';
  try {
    return decodeTransaction(abi.value, txJson.value);
  }
  catch (e: any) {
    error.value = e.toString();
  }
});
</script>

<template>
  <div>
    <NFormItem :label="t('tools.eth-transaction-decoder.texts.label-smart-contract-abi')" mb-2>
      <NInput v-model:value="abi" type="textarea" :placeholder="t('tools.eth-transaction-decoder.texts.placeholder-paste-abi-json-here')" rows="6" />
    </NFormItem>
    <NFormItem :label="t('tools.eth-transaction-decoder.texts.label-raw-transaction-0x-or-json-transaction')" mb-2>
      <NInput v-model:value="txJson" type="textarea" :placeholder="t('tools.eth-transaction-decoder.texts.placeholder-quot-to-quot-quot-0x-quot-quot-data-quot-quot-0x-quot-or-raw-0x')" rows="6" />
    </NFormItem>

    <n-alert v-if="error">
      {{ error }}
    </n-alert>

    <c-card v-if="decoded" :title="t('tools.eth-transaction-decoder.texts.title-decoded-transaction')" mb-2>
      <NFormItem :label="t('tools.eth-transaction-decoder.texts.label-from')">
        <input-copyable :value="decoded.from || 'N/A'" />
      </NFormItem>
      <NFormItem :label="t('tools.eth-transaction-decoder.texts.label-to')">
        <input-copyable :value="decoded.to || 'N/A'" />
      </NFormItem>
      <NFormItem :label="t('tools.eth-transaction-decoder.texts.label-value')">
        <input-copyable :value="decoded.value || '0'" />
      </NFormItem>
      <NFormItem :label="t('tools.eth-transaction-decoder.texts.label-gas')">
        <input-copyable :value="decoded.gas || 'N/A'" />
      </NFormItem>
      <NFormItem :label="t('tools.eth-transaction-decoder.texts.label-gas-price')">
        <input-copyable :value="decoded.gasPrice || 'N/A'" />
      </NFormItem>
      <NFormItem :label="t('tools.eth-transaction-decoder.texts.label-nonce')">
        <input-copyable :value="decoded.nonce || 'N/A'" />
      </NFormItem>
      <NFormItem :label="t('tools.eth-transaction-decoder.texts.label-method')">
        <input-copyable :value="decoded.method || 'N/A'" />
      </NFormItem>
      <NFormItem :label="t('tools.eth-transaction-decoder.texts.label-signature')">
        <input-copyable :value="decoded.signature || 'N/A'" />
      </NFormItem>
      <NFormItem :label="t('tools.eth-transaction-decoder.texts.label-arguments')">
        <CodeBlockCopyable language="json" :value="JSON.stringify(decoded.args, null, 2)" />
      </NFormItem>
    </c-card>

    <c-card v-if="decoded" :title="t('tools.eth-transaction-decoder.texts.title-structured-output-json')">
      <CodeBlockCopyable language="json" :value="JSON.stringify(decoded.outputJson, null, 2)" />
    </c-card>
  </div>
</template>
