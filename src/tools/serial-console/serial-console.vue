<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { NButton, NCard, NInput, NInputGroup, NSelect, NSpace } from 'naive-ui';
import { useSerialPort } from './useSerialPort';

const input = ref('');
const outputRef = ref<HTMLElement | null>(null);
const selectedPort = ref<SerialPort | undefined>();

const {
  isConnected,
  outputLines,
  baudRate,
  lineEnding,
  availablePorts,
  connect,
  disconnect,
  send,
  listPorts,
} = useSerialPort();

const baudOptions = [
  { label: '9600', value: 9600 },
  { label: '19200', value: 19200 },
  { label: '38400', value: 38400 },
  { label: '57600', value: 57600 },
  { label: '115200', value: 115200 },
];

const lineEndingOptions = [
  { label: 'LF (\\n)', value: 'LF' },
  { label: 'CR (\\r)', value: 'CR' },
  { label: 'CRLF (\\r\\n)', value: 'CRLF' },
];

const portOptions = computed(() =>
  availablePorts.value.map((p, i) => ({
    label: `Port ${i + 1} (${p.getInfo().usbVendorId ?? 'Unknown'})`,
    value: p,
  })),
);

function sendCommand() {
  if (!input.value.trim()) {
    return;
  }
  send(input.value);
  input.value = '';
  nextTick(() => {
    outputRef.value?.scrollTo({ top: outputRef.value.scrollHeight, behavior: 'smooth' });
  });
}

onMounted(() => {
  listPorts();
});

function isWindowSecureContext() {
  return window.isSecureContext;
}
</script>

<template>
  <c-alert v-if="!isWindowSecureContext()" mb-2>
    {{ $t('tools.pgp-encryption.texts.tag-your-browser-is-not-in') }}<n-a href="https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts" target="_blank">
      {{ $t('tools.pgp-encryption.texts.tag-secure-context-https') }}
    </n-a>{{ $t('tools.pgp-encryption.texts.tag-this-tool-may-not-work-correctly-and-require-https-to-work-fully') }}
  </c-alert>

  <NCard title="Serial Terminal">
    <NSpace>
      <NSelect
        v-model:value="baudRate"
        :options="baudOptions"
        placeholder="Baud Rate"
        style="width: 150px"
      />
      <NSelect
        v-model:value="lineEnding"
        :options="lineEndingOptions"
        placeholder="Line Ending"
        style="width: 120px"
      />
      <NSelect
        v-model:value="selectedPort"
        :options="portOptions"
        label-field="label"
        value-field="value"
        placeholder="Select Port"
        style="width: 200px"
      />
      <NButton type="primary" :disabled="isConnected" @click="connect(selectedPort)">
        Connect
      </NButton>
      <NButton type="error" :disabled="!isConnected" @click="disconnect">
        Disconnect
      </NButton>
    </NSpace>

    <div ref="outputRef" class="terminal-output">
      <div v-for="(line, index) in outputLines" :key="index" class="terminal-line">
        {{ line }}
      </div>
    </div>

    <NInputGroup>
      <NInput
        v-model:value="input"
        placeholder="Type a command..."
        :disabled="!isConnected"
        @keydown.enter.prevent="sendCommand"
      />
      <NButton type="primary" :disabled="!isConnected" @click="sendCommand">
        Send
      </NButton>
    </NInputGroup>
  </NCard>
</template>

<style scoped>
.terminal-output {
  background-color: #000;
  color: #0f0;
  font-family: monospace;
  padding: 1rem;
  height: 300px;
  overflow-y: auto;
  border-radius: 4px;
  margin: 1rem 0;
  box-shadow: inset 0 0 5px #0f0;
}
.terminal-line {
  white-space: pre-wrap;
}
</style>
