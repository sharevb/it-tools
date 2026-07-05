<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parseCidr } from 'cidr-tools';
import { stringifyIp } from 'ip-bigint';
import QRCodeVue3 from 'qrcode-vue3';
import { WgConfig } from './lib/WgConfig';
import { generateConfigString } from './lib/utils/configParser';

const { t } = useI18n();

const inputConfig = ref('');
const inputConfigError = ref('');
const config = ref(new WgConfig({
  wgInterface: {
    listenPort: 51820,
    dns: [],
    postUp: ['iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE'],
    postDown: ['iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE'],
    address: ['10.0.0.1/24'],
  },
  clientsAllowedIps: ['0.0.0.0/0', '::/0'],
}));

watchEffect(() => {
  if (inputConfig.value) {
    inputConfigError.value = '';
    try {
      config.value.parse(inputConfig.value);
    }
    catch (e: any) {
      inputConfigError.value = e.toString();
    }
  }
});

const cidr = computed<string>({
  get() {
    if (!config.value.wgInterface?.address) {
      return '';
    }
    return config.value.wgInterface.address.join(',') ?? '';
  },
  set(newValue) {
    if (config.value.wgInterface) {
      config.value.wgInterface.address = newValue.split(',').map(s => s.trim());
    }
  },
});
const startIP = ref(2);
const server = computed<string>({
  get() {
    return config.value.wgInterface?.name ?? '';
  },
  set(newValue) {
    if (config.value.wgInterface) {
      config.value.wgInterface.name = newValue;
    }
  },
});
const serverPort = computed<number>({
  get() {
    return config.value.wgInterface?.listenPort ?? 51820;
  },
  set(newValue) {
    if (config.value.wgInterface) {
      config.value.wgInterface.listenPort = newValue;
    }
  },
});
const clientAllowedIPs = computed<string>({
  get() {
    if (!config.value.clientsAllowedIps) {
      return '';
    }
    return config.value.clientsAllowedIps.join(',') ?? '';
  },
  set(newValue) {
    if (config.value) {
      config.value.clientsAllowedIps = newValue.split(',').map(s => s.trim());
    }
  },
});
const endpoint = computed<string>({
  get() {
    return config.value.endpoint ?? '';
  },
  set(newValue) {
    config.value.endpoint = newValue;
  },
});
const dns = computed<string>({
  get() {
    if (!config.value.wgInterface?.dns) {
      return '';
    }
    return config.value.wgInterface.dns.join(',') ?? '';
  },
  set(newValue) {
    if (config.value.wgInterface) {
      config.value.wgInterface.dns = newValue.split(',').map(s => s.trim());
    }
  },
});
const postUpRule = computed<string>({
  get() {
    if (!config.value.wgInterface?.postUp) {
      return '';
    }
    return config.value.wgInterface.postUp.join('\n') ?? '';
  },
  set(newValue) {
    if (config.value.wgInterface) {
      config.value.wgInterface.postUp = newValue.split('\n').map(s => s.trim());
    }
  },
});
const postDownRule = computed<string>({
  get() {
    if (!config.value.wgInterface?.postDown) {
      return '';
    }
    return config.value.wgInterface.postDown.join('\n') ?? '';
  },
  set(newValue) {
    if (config.value.wgInterface) {
      config.value.wgInterface.postDown = newValue.split('\n').map(s => s.trim());
    }
  },
});

const usePreSharedKeys = ref(true);
const numberOfClients = ref(3);

const generatedConfigs = ref<{ server: string; peers: Array<{ name: string; config: string }> } | null>(null);

function generatePeers() {
  config.value.clearPeers();
  config.value.generateKeys({
    preSharedKey: usePreSharedKeys.value,
  });
  const { start: cidrStartIP } = parseCidr(cidr.value);

  for (let i = 0; i < numberOfClients.value; i++) {
    const peer = config.value.createPeer({
      name: `Client ${i + 1}`,
      clientAssignedIP: stringifyIp({
        version: 4,
        number: BigInt(cidrStartIP) + BigInt(startIP.value) + BigInt(i),
      }),
    });
    config.value.addPeer(peer);
  }

  generatedConfigs.value = generateConfigString(config.value);
}
</script>

<template>
  <div>
    <details mb-1>
      <summary>{{ t('tools.wireguard-config-generator.texts.tag-input-server-configuration') }}</summary>
      <c-input-text
        v-model:value="inputConfig"
        :placeholder="t('tools.wireguard-config-generator.texts.placeholder-put-your-input-configuration-here')"
        rows="5"
        multiline
        mb-2
      />
      <c-alert v-if="inputConfigError">
        {{ inputConfigError }}
      </c-alert>
    </details>
    <c-card :title="t('tools.wireguard-config-generator.texts.title-configuration')" mb-1>
      <n-space>
        <c-input-text
          v-model:value="server"
          :label="t('tools.wireguard-config-generator.texts.label-server-name')"
          :placeholder="t('tools.wireguard-config-generator.texts.placeholder-server-name-or-fqdn')"
          label-position="left"
          style="min-width: 400px"
          mb-2
        />
        <n-form-item :label="t('tools.wireguard-config-generator.texts.label-server-port')" label-placement="left">
          <n-input-number v-model:value="serverPort" min="0" max="65535" />
        </n-form-item>
      </n-space>
      <c-input-text
        v-model:value="cidr"
        :label="t('tools.wireguard-config-generator.texts.label-server-cidr')"
        :placeholder="t('tools.wireguard-config-generator.texts.placeholder-server-cidr')"
        label-position="left"
        mb-2
      />
      <n-space>
        <n-form-item :label="t('tools.wireguard-config-generator.texts.label-start-ip-number')" label-placement="left">
          <n-input-number v-model:value="startIP" min="2" />
        </n-form-item>
        <n-form-item :label="t('tools.wireguard-config-generator.texts.label-number-of-clients')" label-placement="left">
          <n-input-number v-model:value="numberOfClients" min="1" />
        </n-form-item>
      </n-space>
      <n-form-item :label="t('tools.wireguard-config-generator.texts.label-use-pre-shared-keys')" label-placement="left">
        <n-checkbox v-model:value="usePreSharedKeys" />
      </n-form-item>
      <c-input-text
        v-model:value="clientAllowedIPs"
        :label="t('tools.wireguard-config-generator.texts.label-client-allowed-ips')"
        :placeholder="t('tools.wireguard-config-generator.texts.placeholder-client-allowed-ips')"
        label-position="left"
        mb-2
      />
      <c-input-text
        v-model:value="endpoint"
        :label="t('tools.wireguard-config-generator.texts.label-endpoint-optional')"
        :placeholder="t('tools.wireguard-config-generator.texts.placeholder-endpoint')"
        label-position="left"
        mb-2
      />
      <c-input-text
        v-model:value="dns"
        :label="t('tools.wireguard-config-generator.texts.label-dns')"
        :placeholder="t('tools.wireguard-config-generator.texts.placeholder-dns-servers')"
        label-position="left"
        mb-2
      />
      <c-input-text
        v-model:value="postUpRule"
        :label="t('tools.wireguard-config-generator.texts.label-post-up-rule')"
        :placeholder="t('tools.wireguard-config-generator.texts.placeholder-post-up-rule')"
        mb-2
      />
      <c-input-text
        v-model:value="postDownRule"
        :label="t('tools.wireguard-config-generator.texts.label-post-down-rule')"
        :placeholder="t('tools.wireguard-config-generator.texts.placeholder-post-down-rule')"
        mb-2
      />
    </c-card>

    <n-space justify="center" mb-2 mt-1>
      <n-button @click="generatePeers">
        {{ t('tools.wireguard-config-generator.texts.tag-generate-configurations') }}
      </n-button>
    </n-space>

    <div v-if="generatedConfigs">
      <n-card :title="t('tools.wireguard-config-generator.texts.title-generated-server-config-file')">
        <textarea-copyable :value="generatedConfigs.server" />
      </n-card>

      <n-card v-for="(peer, index) in generatedConfigs.peers" :key="index" :label="`${peer.name} - Configuration`">
        <n-space>
          <textarea-copyable :value="peer.config" />
          <QRCodeVue3
            :value="peer.config" file-ext="png" :download="true"
            :download-options="{ name: peer.name, extension: 'png' }"
          />
        </n-space>
      </n-card>
    </div>
  </div>
</template>
