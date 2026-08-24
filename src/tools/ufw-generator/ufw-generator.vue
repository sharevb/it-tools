<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const state = reactive({
  action: 'allow',
  direction: 'in',
  protocol: 'tcp',
  port: '',
  portTo: '',
  fromIp: '',
  toIp: '',
  interface: '',
  log: false,
  comment: '',
});

const actionOptions = [
  { label: t('tools.ufw-generator.texts.label-allow'), value: 'allow' },
  { label: t('tools.ufw-generator.texts.label-deny'), value: 'deny' },
  { label: t('tools.ufw-generator.texts.label-reject'), value: 'reject' },
  { label: t('tools.ufw-generator.texts.label-limit'), value: 'limit' },
];

const directionOptions = [
  { label: t('tools.ufw-generator.texts.label-incoming'), value: 'in' },
  { label: t('tools.ufw-generator.texts.label-outgoing'), value: 'out' },
];

const protocolOptions = [
  { label: t('tools.ufw-generator.texts.label-tcp'), value: 'tcp' },
  { label: t('tools.ufw-generator.texts.label-udp'), value: 'udp' },
  { label: t('tools.ufw-generator.texts.label-any'), value: 'any' },
];

const ufwCommand = computed(() => {
  try {
    const parts: string[] = ['ufw'];

    // action
    parts.push(state.action);

    // direction
    if (state.direction) {
      parts.push(state.direction);
    }

    // port or port range
    if (state.port && state.portTo) {
      parts.push(`${state.port}:${state.portTo}`);
    }
    else if (state.port) {
      parts.push(state.port);
    }
    else {
      throw new Error(t('tools.ufw-generator.texts.missing-port'));
    }

    // protocol
    if (state.protocol !== 'any') {
      parts.push(`proto ${state.protocol}`);
    }

    // from
    if (state.fromIp) {
      parts.push(`from ${state.fromIp}`);
    }

    // to
    if (state.toIp) {
      parts.push(`to ${state.toIp}`);
    }

    // interface
    if (state.interface) {
      parts.push(`on ${state.interface}`);
    }

    // logging
    if (state.log) {
      parts.push('log');
    }

    // comment
    if (state.comment) {
      parts.push(`comment '${state.comment.replace(/'/g, '')}'`);
    }

    return parts.join(' ');
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <NForm label-placement="left" label-width="120">
      <NFormItem :label="t('tools.ufw-generator.texts.label-action')">
        <NSelect v-model:value="state.action" :options="actionOptions" />
      </NFormItem>

      <NFormItem :label="t('tools.ufw-generator.texts.label-direction')">
        <NSelect v-model:value="state.direction" :options="directionOptions" />
      </NFormItem>

      <NFormItem :label="t('tools.ufw-generator.texts.label-protocol')">
        <NSelect v-model:value="state.protocol" :options="protocolOptions" />
      </NFormItem>

      <NFormItem :label="t('tools.ufw-generator.texts.label-port')">
        <NInput v-model:value="state.port" :placeholder="t('tools.ufw-generator.texts.placeholder-80')" />
      </NFormItem>

      <NFormItem :label="t('tools.ufw-generator.texts.label-port-to-range')">
        <NInput v-model:value="state.portTo" :placeholder="t('tools.ufw-generator.texts.placeholder-443')" />
      </NFormItem>

      <NFormItem :label="t('tools.ufw-generator.texts.label-from-ip')">
        <NInput v-model:value="state.fromIp" :placeholder="t('tools.ufw-generator.texts.placeholder-192-168-1-10')" />
      </NFormItem>

      <NFormItem :label="t('tools.ufw-generator.texts.label-to-ip')">
        <NInput v-model:value="state.toIp" :placeholder="t('tools.ufw-generator.texts.placeholder-10-0-0-5')" />
      </NFormItem>

      <NFormItem :label="t('tools.ufw-generator.texts.label-interface')">
        <NInput v-model:value="state.interface" :placeholder="t('tools.ufw-generator.texts.placeholder-eth0')" />
      </NFormItem>

      <NFormItem :label="t('tools.ufw-generator.texts.label-logging')">
        <NSwitch v-model:value="state.log" />
      </NFormItem>

      <NFormItem :label="t('tools.ufw-generator.texts.label-comment')">
        <NInput v-model:value="state.comment" :placeholder="t('tools.ufw-generator.texts.placeholder-optional-comment')" />
      </NFormItem>
    </NForm>

    <n-card v-if="ufwCommand" :title="t('tools.ufw-generator.texts.title-generated-command')">
      <textarea-copyable :value="ufwCommand" />
    </n-card>
  </div>
</template>
