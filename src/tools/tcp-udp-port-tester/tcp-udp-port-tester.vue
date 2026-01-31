<script setup lang="ts">
import { useITStorage, useQueryParamOrStorage } from '@/composable/queryParams';

const wsUrl = useITStorage('tcp-udp-port-tester:ws', 'ws://localhost:8080');
const socket = ref<WebSocket | null>(null);
const isConnected = ref(false);
const logs = ref<string[]>([]);

const targetHost = useQueryParamOrStorage({ name: 'target', storageName: 'tcp-udp-port-tester:t', defaultValue: 'localhost' });
const targetPort = useQueryParamOrStorage({ name: 'port', storageName: 'tcp-udp-port-tester:p', defaultValue: 9000 });
const protocol = useQueryParamOrStorage({ name: 'proto', storageName: 'tcp-udp-port-tester:o', defaultValue: 'tcp' });

const protocolOptions = [
  { label: 'TCP', value: 'tcp' },
  { label: 'UDP', value: 'udp' },
];

const textPayload = useQueryParamOrStorage({ name: 'text', storageName: 'tcp-udp-port-tester:e', defaultValue: '' });
const hexPayload = useQueryParamOrStorage({ name: 'hex', storageName: 'tcp-udp-port-tester:h', defaultValue: '' });

function connect() {
  if (socket.value && isConnected.value) {
    addLog('⚠️ Already connected');
    return;
  }

  socket.value = new WebSocket(wsUrl.value);
  socket.value.binaryType = 'arraybuffer';

  socket.value.onopen = () => {
    isConnected.value = true;
    addLog('✅ Connected to WebSocket bridge');
  };

  socket.value.onmessage = (event) => {
    try {
      const json = JSON.parse(event.data);
      if (json.error) {
        addLog(`❌ Error: ${json.error}`);
      }
      else if (json.end) {
        addLog(`🛑 End: ${json.end}`);
      }
    }
    catch {
      if (typeof event.data === 'string') {
        addLog(`📩 Text: ${event.data}`);
      }
      else {
        const buffer = new Uint8Array(event.data);
        addLog(`📩 Binary: ${Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
        try {
          addLog(`📩 Text: ${new TextDecoder().decode(buffer)}`);
        }
        catch {}
      }
    }
  };

  socket.value.onclose = () => {
    isConnected.value = false;
    addLog('🔌 Disconnected');
  };
}

function disconnect() {
  if (!socket.value) {
    addLog('⚠️ No active connection');
    return;
  }

  addLog('🔻 Disconnecting...');
  socket.value.close();
  socket.value = null;
  isConnected.value = false;
}

function configureTarget() {
  if (socket.value && isConnected.value) {
    const config = {
      type: 'config',
      protocol: protocol.value,
      host: targetHost.value,
      port: targetPort.value,
    };
    socket.value.send(JSON.stringify(config));
    addLog(`⚙️ Configured ${protocol.value.toUpperCase()} → ${targetHost.value}:${targetPort.value}`);
  }
}

function sendText() {
  if (socket.value && isConnected.value && textPayload.value.trim() !== '') {
    socket.value.send(JSON.stringify({ type: 'send', payload: textPayload.value.replace(/\\n/g, '\n').replace(/\\r/g, '\r') }));
    addLog(`➡️ Sent text: ${textPayload.value}`);
  }
}

function sendHex() {
  if (socket.value && isConnected.value) {
    const buffer = hexStringToBytes(hexPayload.value);
    socket.value.send(JSON.stringify({ type: 'send', payload: buffer }));
    addLog(`➡️ Sent hex: ${hexPayload.value}`);
  }
}

function hexStringToBytes(hex: string): number[] {
  return hex.match(/.{1,2}/g)?.map(byte => Number.parseInt(byte, 16)) ?? [];
}

function clearLogs() {
  logs.value = [];
}

const logsRef = ref<HTMLDivElement | null>(null);

function addLog(entry: string) {
  logs.value.push(entry);
  nextTick(() => {
    if (logsRef.value) {
      logsRef.value.scrollTop = logsRef.value.scrollHeight;
    }
  });
}

onMounted(() => connect());
onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.close();
  }
});
</script>

<template>
  <div>
    <div mb-1>
      <details mb-2>
        <summary mb-1>
          WebSocket TCP/UDP Bridge Configuration
        </summary>
        <c-input-text v-model:value="wsUrl" label="WebSocket TCP/UDP Bridge Url:" label-position="left" placeholder="WebSocket URL" mb-1 />
        <n-p mb-1>
          To use this tool, you need to host a WebSocket TCP/UDP Bridge based on
          <c-link target="_blank" href="https://github.com/sharevb/ws-tcp-udp-bridge?tab=readme-ov-file#running-with-it-tools">
            https://github.com/sharevb/ws-tcp-udp-bridge
          </c-link>
        </n-p>

        <n-space justify="center">
          <n-button type="primary" :disabled="isConnected" @click="connect">
            Connect
          </n-button>
          <n-button type="error" :disabled="!isConnected" @click="disconnect">
            Disconnect
          </n-button>
        </n-space>
      </details>

      <n-space justify="center">
        <n-tag :type="isConnected ? 'success' : 'error'">
          {{ isConnected ? "Connected" : "Disconnected" }}
        </n-tag>
      </n-space>
    </div>

    <n-form-item label="Target:" label-placement="left">
      <n-input v-model:value="targetHost" placeholder="Target IP" mr-1 />
      <n-input-number v-model:value="targetPort" placeholder="Port" style="width: 250px" mr-1 />

      <n-select
        v-model:value="protocol"
        :options="protocolOptions"
        placeholder="Protocol"
        style="width: 250px"
        mr-1
      />
      <n-button type="primary" :disabled="!isConnected" @click="configureTarget">
        Apply Configuration
      </n-button>
    </n-form-item>

    <n-card title="Logs" mb-1>
      <n-space justify="center" mb-1>
        <n-button @click="clearLogs">
          Clear logs
        </n-button>
      </n-space>
      <div ref="logsRef" style="font-size: .8em; height: 250px; overflow-y: scroll">
        <pre v-for="(msg, idx) in logs" :key="idx" style="white-space: pre-wrap">{{ msg }}</pre>
      </div>
    </n-card>

    <n-card title="Payload Builder" mb-1>
      <n-form-item label="Send Text payload (can add \r \n):" label-placement="left">
        <n-input
          v-model:value="textPayload"
          placeholder="Text payload"
          mr-1
        />
        <n-button :disabled="!isConnected" @click="sendText">
          Send
        </n-button>
      </n-form-item>

      <n-form-item label="Send Hex payload:" label-placement="left">
        <n-input
          v-model:value="hexPayload"
          placeholder="Hex payload (e.g. 48656c6c6f)"
          mr-1
        />
        <n-button :disabled="!isConnected" @click="sendHex">
          Send
        </n-button>
      </n-form-item>
    </n-card>
  </div>
</template>

<style scoped>
.log {
  margin-top: 20px;
  background: #f4f4f4;
  padding: 10px;
  border-radius: 6px;
}
</style>
