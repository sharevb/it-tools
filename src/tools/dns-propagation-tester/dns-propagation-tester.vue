<script setup lang="ts">
import { useITStorage, useQueryParamOrStorage } from '@/composable/queryParams';
import { useNetworkUtilsConfig } from '@/tools/network-utils/network-utils-config';
import { Base64 } from 'js-base64';

const { serverHost, serverAuth, hasFixedConfig } = useNetworkUtilsConfig({
  toolKey: 'dns-prop',
  urlStorageKey: 'dns-prop:url',
  authStorageKey: 'dns-prop:auth',
});

const loading = ref(false);

async function api(path: string, params: Record<string, string | number | boolean> = {}) {
  const pathParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => pathParams.append(k, v?.toString() || ''));

  const url = `${serverHost.value}${path}?${pathParams.toString()}`;

  const response = await fetch(url,
    serverAuth.value
      ? {
          method: 'GET',
          headers: { Authorization: `Basic ${Base64.encode(serverAuth.value)}` },
        }
      : undefined);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Server error');
  }

  return await response.json();
}

const builtinResolvers = [
  { name: 'Google', ip: '8.8.8.8' },
  { name: 'Google', ip: '8.8.4.4' },
  { name: 'Cloudflare', ip: '1.1.1.1' },
  { name: 'Cloudflare', ip: '1.0.0.1' },
  { name: 'Quad9', ip: '9.9.9.9' },
  { name: 'Quad9', ip: '149.112.112.112' },
  { name: 'OpenDNS', ip: '208.67.222.222' },
  { name: 'OpenDNS', ip: '208.67.220.220' },
  { name: 'CleanBrowsing', ip: '185.228.168.9' },
  { name: 'CleanBrowsing', ip: '185.228.169.9' },

  // Europe
  { name: 'DNS.Watch', ip: '84.200.69.80' },
  { name: 'DNS.Watch', ip: '84.200.70.40' },
  { name: 'FreeDNS', ip: '37.235.1.174' },
  { name: 'FreeDNS', ip: '37.235.1.177' },
  { name: 'FDN France', ip: '80.67.169.12' },
  { name: 'FDN France', ip: '80.67.169.40' },
  { name: 'Neustar EU', ip: '156.154.70.1' },
  { name: 'Neustar EU', ip: '156.154.71.1' },

  // North America
  { name: 'Level3', ip: '209.244.0.3' },
  { name: 'Level3', ip: '209.244.0.4' },
  { name: 'Comodo', ip: '8.26.56.26' },
  { name: 'Comodo', ip: '8.20.247.20' },
  { name: 'CenturyLink', ip: '205.171.3.65' },
  { name: 'CenturyLink', ip: '205.171.2.65' },

  // Asia-Pacific
  { name: 'DNSPod', ip: '119.29.29.29' },
  { name: 'AliDNS', ip: '223.5.5.5' },
  { name: 'AliDNS', ip: '223.6.6.6' },
  { name: 'Yandex', ip: '77.88.8.8' },
  { name: 'Yandex', ip: '77.88.8.1' },
  { name: 'Naver Korea', ip: '125.209.222.141' },
  { name: 'Naver Korea', ip: '125.209.249.1' },

  // South America
  { name: 'GigaDNS Brazil', ip: '189.38.95.95' },
  { name: 'GigaDNS Brazil', ip: '189.38.95.96' },

  // Africa
  { name: 'OpenDNS Africa', ip: '196.3.132.153' },
  { name: 'OpenDNS Africa', ip: '196.3.132.154' },
];

interface Resolver {
  ip: string
  name: string
}

const customResolvers = useITStorage<Resolver[]>('dns-prop:cust', []);
const resolvers = computed(() => [
  ...builtinResolvers,
  ...customResolvers.value,
]);

const propDomain = useQueryParamOrStorage({ name: 'domain', storageName: 'dns-prop:d', defaultValue: '' });
const propType = useQueryParamOrStorage({ name: 'type', storageName: 'dns-prop:t', defaultValue: 'A' });

const selectedResolvers = ref<string[]>([]);

interface DNSQueryResult {
  ok: boolean
  domain: string
  record_type: string
  answers?: string[] | null
  error?: string | null
}
type Result = Record<string, { status: 'checking' | 'success' | 'error'; result?: DNSQueryResult }>;
const propResults = reactive<Result>({});

// -------------------- Custom DNS Resolvers --------------------

const newResolverName = ref('');
const newResolverIp = ref('');

function addCustomResolver() {
  if (!newResolverName.value || !newResolverIp.value) {
    return;
  }

  customResolvers.value.push({
    name: newResolverName.value,
    ip: newResolverIp.value,
  });

  newResolverName.value = '';
  newResolverIp.value = '';
}

function removeCustomResolver(ip: string) {
  customResolvers.value = customResolvers.value.filter(r => r.ip !== ip);
}

async function runPropagation() {
  Object.assign(propResults, {});

  for (const ip of selectedResolvers.value) {
    propResults[ip] = {
      status: 'checking',
    };
  }

  loading.value = true;

  const allPromises: Promise<void>[] = [];
  for (const ip of selectedResolvers.value) {
    allPromises.push((async () => {
      try {
        const dnsResult = await api('/dns-query', {
          domain: propDomain.value,
          record_type: propType.value,
          resolver_ip: ip,
        });
        propResults[ip] = {
          status: dnsResult.ok ? 'success' : 'error',
          result: dnsResult,
        };
      }
      catch (err: any) {
        propResults[ip] = {
          status: 'error',
          result: {
            ok: false,
            domain: propDomain.value,
            record_type: propType.value,
            error: err.toString(),
          },
        };
      }
    })());
  }
  Promise.all(allPromises).then(() => {
    loading.value = false;
  });
}
</script>

<template>
  <div>
    <details v-if="!hasFixedConfig" mb-2>
      <summary>Network Utilities Service Configuration (self hosted)</summary>
      <n-card>
        <NFormItem label="Network Utilities Service Url:" label-placement="top">
          <NInput v-model:value="serverHost" placeholder="http://localhost:3000" />
        </NFormItem>
        <NFormItem label="Basic Authentication:" label-placement="left" label-width="auto">
          <NInput v-model:value="serverAuth" placeholder="username:password" />
        </NFormItem>
        <n-p>
          You must self host Network Utilities Service. See:
          <c-link href="https://github.com/sharevb/network-utils-ws#running-in-docker" target="_blank">
            Network Utilities Service docker install
          </c-link>
        </n-p>
      </n-card>
    </details>

    <n-tabs type="line" animated>
      <n-tab-pane name="propagation" tab="DNS Propagation">
        <n-form>
          <c-input-text v-model:value="propDomain" label="Domain:" label-position="left" placeholder="example.com" mb-1 />
          <c-select
            v-model:value="propType" label="Record Type:"
            mb-1
            label-position="left"
            :options="['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SRV', 'SOA', 'CAA', 'DS', 'DNSKEY'].map(x => ({ label: x, value: x }))"
          />

          <n-card title="Resolvers to Check" mb-2>
            <n-space justify="center" mb-1 gap-1>
              <n-button size="tiny" @click="selectedResolvers = resolvers.map(r => r.ip)">
                Select All
              </n-button>
              <n-button size="tiny" @click="selectedResolvers = []">
                Deselect All
              </n-button>
            </n-space>
            <n-checkbox-group v-model:value="selectedResolvers">
              <n-space wrap>
                <n-checkbox
                  v-for="r in resolvers"
                  :key="r.ip"
                  :value="r.ip"
                >
                  {{ r.name }} <em>({{ r.ip }})</em>
                </n-checkbox>
              </n-space>
            </n-checkbox-group>
          </n-card>

          <n-space justify="center" mb-1>
            <n-button type="primary" :disabled="!propDomain || !propType || !selectedResolvers.length || loading" :loading="loading" @click="runPropagation">
              Check Propagation
            </n-button>
          </n-space>
        </n-form>

        <n-card v-if="Object.keys(propResults).length" title="Results">
          <table>
            <thead>
              <tr>
                <th>Resolver</th>
                <th>Resolver IP</th>
                <th>Status</th>
                <th>Answers</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(res, ip) in propResults" :key="ip">
                <td>{{ resolvers.find(r => r.ip === ip)?.name || ip }}</td>
                <td>{{ ip }}</td>
                <td>
                  <n-tag :type="res.status === 'success' ? 'success' : res.status === 'error' ? 'error' : 'default'">
                    {{ res.status }}
                  </n-tag>
                </td>
                <td>
                  <div v-if="res.result?.error" style="color: red;">
                    {{ res.result.error }}
                  </div>
                  <div v-else-if="res.status === 'checking'">
                    Checking...
                  </div>
                  <ul v-else-if="res.result?.answers">
                    <li v-for="(a, idx) in res.result.answers" :key="idx">
                      {{ a }}
                    </li>
                  </ul>
                  <div v-else>
                    No answers
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </n-card>
      </n-tab-pane>

      <n-tab-pane name="custom-resolvers" tab="Custom Resolvers">
        <n-card title="Add Custom Resolver">
          <c-input-text v-model:value="newResolverName" label="Resolver Name:" label-width="120px" label-position="left" placeholder="Resolver name (e.g. My DNS)" mb-1 />
          <c-input-text v-model:value="newResolverIp" label="Resolver IP:" label-width="120px" label-position="left" placeholder="Resolver IP (e.g. 10.0.0.1)" mb-1 />

          <n-space justify="center" mb-1>
            <n-button type="primary" @click="addCustomResolver">
              Add Resolver
            </n-button>
          </n-space>
        </n-card>

        <n-card v-if="customResolvers.length" title="Your Custom Resolvers">
          <div
            v-for="r in customResolvers"
            :key="r.ip"
          >
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>{{ r.name }} — {{ r.ip }}</div>
              <n-button type="error" size="tiny" @click="removeCustomResolver(r.ip)">
                Remove
              </n-button>
            </div>
          </div>
        </n-card>

        <n-card v-else>
          No custom resolvers added yet.
        </n-card>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
