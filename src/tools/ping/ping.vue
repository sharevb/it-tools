<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useNetworkUtilsConfig } from '@/tools/network-utils/network-utils-config';
import { expandCidr } from 'cidr-tools';
import { Base64 } from 'js-base64';

const { t } = useI18n();

const { serverHost, serverAuth, hasFixedConfig } = useNetworkUtilsConfig({
  urlStorageKey: 'ping:url',
  authStorageKey: 'ping:auth',
});

interface PingResult {
  target: string;
  ip?: string;
  reachable: boolean;
  avg_rtt_ms?: number | null;
  packet_loss?: number | null;
  error?: string | null;
  ok: boolean;
}

const MAX_CIDR_IPS = 1024;

const rawTargets = ref('');
const count = ref(1);
const timeout = ref(2);

const loading = ref(false);
const results = ref<PingResult[]>([]);
const progress = ref(0);

import { getMatch } from 'ip-matching';

function getAllIPs(range: string) {
  const matchMasks = getMatch(range)?.convertToMasks() || [];

  const subnets = matchMasks
    .map((mask) => {
      const subnet = mask.convertToSubnet();
      if (!subnet) {
        return { cidr: '', start: '', end: '' };
      }
      return {
        cidr: subnet.toString(),
        start: subnet.getFirst().toString(),
        end: subnet.getLast().toString(),
      };
    })
    .filter((subnet) => subnet.cidr !== '');

  return subnets.flatMap((s) => [...expandCidr(s.cidr)]);
}

function parseTargets(): string[] {
  const raw = rawTargets.value
    .split(/\n|,|;/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const expanded: string[] = [];

  for (const v of raw) {
    try {
      const ips = [...getAllIPs(v)];
      const hostCount = ips.length;
      if (hostCount > MAX_CIDR_IPS) {
        // Add synthetic error result
        results.value.push({
          ok: false,
          target: v,
          reachable: false,
          error: t('tools.ping.texts.cidr-expands-to-hostcount-ips-exceeding-limit-of-max_cidr_ips', [
            hostCount,
            MAX_CIDR_IPS,
          ]),
        });
        continue;
      }
      expanded.push(...ips);
    } catch (ex: any) {
      expanded.push(v);
    }
  }

  return expanded;
}

async function api(path: string, params: Record<string, string | number | boolean> = {}) {
  const pathParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => pathParams.append(k, v?.toString() || ''));

  const url = `${serverHost.value}${path}?${pathParams.toString()}`;

  const response = await fetch(
    url,
    serverAuth.value
      ? {
          method: 'GET',
          headers: { Authorization: `Basic ${Base64.encode(serverAuth.value)}` },
        }
      : undefined,
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Server error');
  }

  return await response.json();
}

async function pingTarget(target: string): Promise<PingResult> {
  try {
    return await api('/ping', {
      target,
      timeout: timeout.value,
      count: count.value,
    });
  } catch (err: any) {
    return {
      ok: false,
      target,
      reachable: false,
      error: err.toString(),
    };
  }
}

async function runPingBatch() {
  results.value = []; // reset including synthetic CIDR errors

  const targets = parseTargets();
  if (!targets.length) {
    return;
  }

  loading.value = true;
  progress.value = 0;

  const total = targets.length;
  let processed = 0;

  for (const t of targets) {
    const r = await pingTarget(t);
    results.value.push(r);
    processed++;
    progress.value = Math.round((processed / total) * 100);
  }

  loading.value = false;
}
</script>

<template>
  <div>
    <details v-if="!hasFixedConfig" mb-2>
      <summary>
        ⚠ {{ t('tools.external-self-hosted-required') }} ⚠ -
        {{ t('tools.https-tester.texts.tag-network-utilities-service-configuration-self-hosted') }}
      </summary>
      <n-card>
        <NFormItem :label="t('tools.https-tester.texts.label-network-utilities-service-url')" label-placement="top">
          <NInput
            v-model:value="serverHost"
            :placeholder="t('tools.https-tester.texts.placeholder-http-localhost-3000')"
          />
        </NFormItem>
        <NFormItem
          :label="t('tools.https-tester.texts.label-basic-authentication')"
          label-placement="left"
          label-width="auto"
        >
          <NInput
            v-model:value="serverAuth"
            :placeholder="t('tools.https-tester.texts.placeholder-username-password')"
          />
        </NFormItem>
        <n-p
          >{{ t('tools.https-tester.texts.tag-you-must-self-host-network-utilities-service-see') }}
          <c-link href="https://github.com/sharevb/network-utils-ws#running-in-docker" target="_blank"
            >{{ t('tools.https-tester.texts.tag-network-utilities-service-docker-install') }}
          </c-link>
        </n-p>
      </n-card>
    </details>

    <c-input-text
      :label="t('tools.ping.texts.label-targets-ips-cidrs-hostnames-one-per-line-or-or')"
      multiline
      rows="5"
      v-model:value="rawTargets"
      :placeholder="t('tools.ping.texts.placeholder-192-168-1-1-10-google-com-10-10-0-0-0-24')"
      mb-1
    />

    <NSpace justify="center" mb-1>
      <NFormItem :label="t('tools.ping.texts.label-count')" label-placement="left">
        <NInputNumber v-model:value="count" :min="1" :max="10" />
      </NFormItem>
      <NFormItem :label="t('tools.ping.texts.label-timeout-seconds')" label-placement="left">
        <NInputNumber v-model:value="timeout" :min="1" :max="10" />
      </NFormItem>
    </NSpace>
    <NSpace justify="center">
      <NButton type="primary" :loading="loading" @click="runPingBatch" :disabled="!rawTargets">{{
        t('tools.ping.texts.tag-ping-all')
      }}</NButton>
    </NSpace>

    <div v-if="loading">
      <NProgress type="line" :percentage="progress" />
    </div>

    <NDivider />

    <NTable v-if="results.length">
      <thead>
        <tr>
          <th>{{ t('tools.ping.texts.tag-target') }}</th>
          <th>{{ t('tools.ping.texts.tag-ip') }}</th>
          <th>{{ t('tools.ping.texts.tag-status') }}</th>
          <th>{{ t('tools.ping.texts.tag-avg-rtt-ms') }}</th>
          <th>{{ t('tools.ping.texts.tag-packet-loss') }}</th>
          <th>{{ t('tools.ping.texts.tag-error') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in results" :key="r.target">
          <td>{{ r.target }}</td>
          <td>{{ r.ip ?? '-' }}</td>
          <td>
            <NTag :type="r.reachable ? 'success' : 'error'">
              {{ r.reachable ? t('tools.ping.texts.tag-reachable') : t('tools.ping.texts.tag-unreachable') }}
            </NTag>
          </td>
          <td>{{ r.avg_rtt_ms ?? '-' }}</td>
          <td>{{ r.packet_loss ?? '-' }}</td>
          <td>{{ r.error ?? '-' }}</td>
        </tr>
      </tbody>
    </NTable>
  </div>
</template>
