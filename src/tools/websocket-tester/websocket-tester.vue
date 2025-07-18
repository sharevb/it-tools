<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import WSC from 'w-websocket-client/dist/w-websocket-client.umd.js';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const url = useQueryParamOrStorage({ name: 'url', storageName: 'ws-tester:url', defaultValue: 'ws://host:port' });
const token = useQueryParamOrStorage({ name: 'token', storageName: 'ws-tester:token', defaultValue: '*' });
const logs = ref<string[]>([]);
const message = ref('');
const connected = ref(false);
let wsc: WSC;

function send() {
  logs.value.push(`Sent: ${message.value}`);
  wsc.send(message.value);
}
function connect() {
  wsc = new WSC({
    url: url.value,
    token: token.value,
    open() {
      logs.value.push('WebSocket Connection opened');
      connected.value = true;
    },
    close() {
      connected.value = false;
      logs.value.push('WebSocket Connection closed');
    },
    message(data: any) {
      logs.value.push(`Received: ${JSON.stringify(data)}`);
    },
    error(err: any) {
      logs.value.push(`Error: ${err}`);
    },
  });
}
</script>

<template>
  <div>
    <c-card :title="t('tools.websocket-tester.texts.title-connection')">
      <c-input-text
        v-model:value="url"
        :placeholder="t('tools.websocket-tester.texts.placeholder-enter-url-of-websocket-server-here')"
        :label="t('tools.websocket-tester.texts.label-url')"
        raw-text
      />
      <c-input-text
        v-model:value="token"
        :placeholder="t('tools.websocket-tester.texts.placeholder-enter-token-here')"
        :label="t('tools.websocket-tester.texts.label-token')"
        raw-text
      />
      <div v-if="!connected" mt-5 flex justify-center>
        <c-button @click="connect()">
          {{ t('tools.websocket-tester.texts.tag-connect') }}
        </c-button>
      </div>
    </c-card>
    <c-card v-if="connected" :title="t('tools.websocket-tester.texts.title-send')">
      <c-input-text
        v-model:value="message"
        :placeholder="t('tools.websocket-tester.texts.placeholder-enter-message-to-send-here')"
        :label="t('tools.websocket-tester.texts.label-message')"
        rows="5"
        autosize
        raw-text
        multiline
        monospace
      />
      <div mt-5 flex justify-center>
        <c-button @click="send()">
          {{ t('tools.websocket-tester.texts.tag-send') }}
        </c-button>
      </div>
    </c-card>
    <c-card :title="t('tools.websocket-tester.texts.title-logs')">
      <ul>
        <li v-for="(line, index) in logs" :key="index">
          {{ line }}
        </li>
      </ul>
    </c-card>
  </div>
</template>
