<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const actionOptions = [
  { label: t('tools.iptables-generator.texts.label-accept'), value: 'ACCEPT' },
  { label: t('tools.iptables-generator.texts.label-drop'), value: 'DROP' },
  { label: t('tools.iptables-generator.texts.label-reject'), value: 'REJECT' },
];

const protocolOptions = [
  { label: t('tools.iptables-generator.texts.label-tcp'), value: 'tcp' },
  { label: t('tools.iptables-generator.texts.label-udp'), value: 'udp' },
  { label: t('tools.iptables-generator.texts.label-icmp'), value: 'icmp' },
  { label: t('tools.iptables-generator.texts.label-ip'), value: 'ip' },
];

const chainOptions = [
  { label: t('tools.iptables-generator.texts.label-input'), value: 'INPUT' },
  { label: t('tools.iptables-generator.texts.label-output'), value: 'OUTPUT' },
  { label: t('tools.iptables-generator.texts.label-forward'), value: 'FORWARD' },
  { label: t('tools.iptables-generator.texts.label-prerouting'), value: 'PREROUTING' },
];

const action = ref('ACCEPT');
const protocol = ref('tcp');
const sourceIP = ref('');
const destinationIP = ref('');
const sourcePort = ref<number | null>(null);
const destinationPort = ref<number | null>(null);
const ruleOrder = ref<number | null>(null);
const chain = ref('INPUT');
const command = computed(() => {
  let cmd = `iptables -A ${chain.value}`;
  if (ruleOrder.value) {
    cmd += ` ${ruleOrder.value}`;
  }
  if (protocol.value) {
    cmd += ` -p ${protocol.value}`;
  }
  if (sourceIP.value) {
    cmd += ` -s ${sourceIP.value}`;
  }
  if (destinationIP.value) {
    cmd += ` -d ${destinationIP.value}`;
  }
  if (sourcePort.value !== null) {
    cmd += ` --sport ${sourcePort.value}`;
  }
  if (destinationPort.value !== null) {
    cmd += ` --dport ${destinationPort.value}`;
  }
  cmd += ` -j ${action.value}`;
  return cmd;
});
</script>

<template>
  <NForm label-placement="left" label-width="140px">
    <NFormItem :label="t('tools.iptables-generator.texts.label-action')">
      <NSelect v-model:value="action" :options="actionOptions" />
    </NFormItem>
    <NFormItem :label="t('tools.iptables-generator.texts.label-protocol')">
      <NSelect v-model:value="protocol" :options="protocolOptions" />
    </NFormItem>
    <NFormItem :label="t('tools.iptables-generator.texts.label-source-ip')">
      <NInput v-model:value="sourceIP" />
    </NFormItem>
    <NFormItem :label="t('tools.iptables-generator.texts.label-destination-ip')">
      <NInput v-model:value="destinationIP" />
    </NFormItem>
    <NFormItem :label="t('tools.iptables-generator.texts.label-source-port')">
      <NInputNumber v-model:value="sourcePort" />
    </NFormItem>
    <NFormItem :label="t('tools.iptables-generator.texts.label-destination-port')">
      <NInputNumber v-model:value="destinationPort" />
    </NFormItem>
    <NFormItem :label="t('tools.iptables-generator.texts.label-chain')">
      <NSelect v-model:value="chain" :options="chainOptions" />
    </NFormItem>
    <NFormItem :label="t('tools.iptables-generator.texts.label-rule-order')">
      <NInputNumber v-model:value="ruleOrder" />
    </NFormItem>
  </NForm>

  <c-card :title="t('tools.iptables-generator.texts.title-generated-iptables-command')">
    <textarea-copyable :value="command" />
  </c-card>

  <n-divider />

  <table border="1" class="w-full border-collapse text-left text-sm text-gray-500 dark:text-gray-400">
    <thead>
      <tr>
        <td><strong>{{ t('tools.iptables-generator.texts.tag-expression') }}</strong></td>
        <td><strong>{{ t('tools.iptables-generator.texts.tag-meaning') }}</strong></td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ t('tools.iptables-generator.texts.tag-iptables-l') }}</td>
        <td>{{ t('tools.iptables-generator.texts.tag-list-all-rules-in-the-selected-chain') }}</td>
      </tr>
      <tr>
        <td>{{ t('tools.iptables-generator.texts.tag-iptables-t-nat-n-l') }}</td>
        <td>{{ t('tools.iptables-generator.texts.tag-list-all-nat-rules') }}</td>
      </tr>
      <tr>
        <td>{{ t('tools.iptables-generator.texts.tag-iptables-l-n-line-numbers') }}</td>
        <td>{{ t('tools.iptables-generator.texts.tag-list-all-rules-including-their-line-number') }}</td>
      </tr>
      <tr>
        <td>{{ t('tools.iptables-generator.texts.tag-iptables-f') }}</td>
        <td>{{ t('tools.iptables-generator.texts.tag-delete-existing-rules') }}</td>
      </tr>
      <tr>
        <td>{{ t('tools.iptables-generator.texts.tag-iptables-d-input-2') }}</td>
        <td>{{ t('tools.iptables-generator.texts.tag-delete-the-second-rule-in-the-input-chain') }}</td>
      </tr>
      <tr>
        <td>{{ t('tools.iptables-generator.texts.tag-iptables-t-nat-d-prerouting-2') }}</td>
        <td>{{ t('tools.iptables-generator.texts.tag-delete-the-second-rule-in-the-nat-table') }}</td>
      </tr>
      <tr>
        <td>{{ t('tools.iptables-generator.texts.tag-iptables-a-input-s-lt-ip-address-gt-j-drop') }}</td>
        <td>{{ t('tools.iptables-generator.texts.tag-block-a-specific-ip-address') }}</td>
      </tr>
      <tr>
        <td>{{ t('tools.iptables-generator.texts.tag-iptables-a-input-p-tcp-dport-80-m-limit-limit-25-minute-limit-burst-100-j-accept') }}</td>
        <td>{{ t('tools.iptables-generator.texts.tag-limit-connections-to-25-per-minute-on-port-80-after-100-connections-have-been-reached') }}</td>
      </tr>
      <tr>
        <td>{{ t('tools.iptables-generator.texts.tag-iptables-n-mychain') }}</td>
        <td>{{ t('tools.iptables-generator.texts.tag-create-a-new-chain-called-mychain') }}</td>
      </tr>
    </tbody>
  </table>
</template>
