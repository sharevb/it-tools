<script setup lang="ts">
import { decodeTransaction } from './eth-transaction-decoder.service';

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
    <NFormItem label="Smart Contract ABI:" mb-2>
      <NInput v-model:value="abi" type="textarea" placeholder="Paste ABI JSON here" rows="6" />
    </NFormItem>
    <NFormItem label="Raw Transaction (0x...) or JSON Transaction:" mb-2>
      <NInput v-model:value="txJson" type="textarea" placeholder="{&quot;to&quot;:&quot;0x...&quot;,&quot;data&quot;:&quot;0x...&quot;} or raw 0x...." rows="6" />
    </NFormItem>

    <n-alert v-if="error">
      {{ error }}
    </n-alert>

    <c-card v-if="decoded" title="Decoded Transaction" mb-2>
      <NFormItem label="From">
        <input-copyable :value="decoded.from || 'N/A'" />
      </NFormItem>
      <NFormItem label="To">
        <input-copyable :value="decoded.to || 'N/A'" />
      </NFormItem>
      <NFormItem label="Value">
        <input-copyable :value="decoded.value || '0'" />
      </NFormItem>
      <NFormItem label="Gas">
        <input-copyable :value="decoded.gas || 'N/A'" />
      </NFormItem>
      <NFormItem label="Gas Price">
        <input-copyable :value="decoded.gasPrice || 'N/A'" />
      </NFormItem>
      <NFormItem label="Nonce">
        <input-copyable :value="decoded.nonce || 'N/A'" />
      </NFormItem>
      <NFormItem label="Method">
        <input-copyable :value="decoded.method || 'N/A'" />
      </NFormItem>
      <NFormItem label="Signature">
        <input-copyable :value="decoded.signature || 'N/A'" />
      </NFormItem>
      <NFormItem label="Arguments">
        <textarea-copyable language="json" :value="JSON.stringify(decoded.args, null, 2)" />
      </NFormItem>
    </c-card>

    <c-card v-if="decoded" title="Structured Output JSON">
      <textarea-copyable language="json" :value="JSON.stringify(decoded.outputJson, null, 2)" />
    </c-card>
  </div>
</template>
