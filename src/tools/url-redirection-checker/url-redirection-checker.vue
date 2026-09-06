<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useNetworkUtilsConfig } from '@/tools/network-utils/network-utils-config';
import { expandCidr } from 'cidr-tools';
import { Base64 } from 'js-base64';

const { t } = useI18n();

export interface Hop {
  index: number;
  url: string;
  status_code: number;
  duration_ms: number;
  headers: Record<string, string>;
  is_redirect: boolean;
  location?: string | null;
  body_preview?: string | null;
  body_truncated: boolean;
}

export interface RedirectChain {
  input_url: string;
  final_url: string;
  hop_count: number;
  chain: Hop[];
  warnings: string[];
}

const { serverHost, serverAuth, hasFixedConfig } = useNetworkUtilsConfig({
  urlStorageKey: 'ping:url',
  authStorageKey: 'ping:auth',
});

const url = ref('');
const method = ref<'GET' | 'HEAD'>('GET');
const userAgent = ref('Mozilla/5.0 (Copilot Redirect Checker)');
const previewBytes = ref(512);
const includeBody = ref(false);
const maxHops = ref(10);

const loading = ref(false);
const error = ref<string | null>(null);
const result = ref<RedirectChain | null>(null);

async function runRedirectChain() {
  error.value = null;
  result.value = null;
  loading.value = true;

  try {
    const params = new URLSearchParams({
      url: url.value,
      method: method.value,
      user_agent: userAgent.value,
      preview_bytes: previewBytes.value.toString(),
      include_body: includeBody.value.toString(),
      max_hops: maxHops.value.toString(),
    });

    const res = await fetch(
      `${serverHost.value}/redirect-chain?${params.toString()}`,
      serverAuth.value
        ? {
            method: 'GET',
            headers: { Authorization: `Basic ${Base64.encode(serverAuth.value)}` },
          }
        : undefined,
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || 'Unknown error');
    }

    result.value = await res.json();
  } catch (err: any) {
    error.value = err.toString();
  } finally {
    loading.value = false;
  }
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

    <n-form label-placement="left" label-width="100px" mb-2>
      <n-form-item label="URL:">
        <n-input v-model:value="url" placeholder="https://example.com" />
      </n-form-item>

      <n-form-item label="Method:">
        <n-select
          v-model:value="method"
          :options="[
            { label: 'GET', value: 'GET' },
            { label: 'HEAD', value: 'HEAD' },
          ]"
        />
      </n-form-item>

      <n-form-item label="User Agent:">
        <n-input v-model:value="userAgent" />
      </n-form-item>

      <n-form-item label="Max Hops:">
        <n-input-number v-model:value="maxHops" :min="1" :max="50" />
      </n-form-item>

      <n-space justify="center">
        <n-form-item label="Include Body Preview" label-width="auto">
          <n-switch v-model:value="includeBody" />
        </n-form-item>

        <n-form-item v-if="includeBody" label="Preview Bytes:" ml-3>
          <n-input-number v-model:value="previewBytes" :min="0" :max="50000" />
        </n-form-item>
      </n-space>
    </n-form>

    <n-space justify="center" mb-2>
      <n-button :loading="loading" type="primary" :disabled="!url" @click="runRedirectChain">
        Inspect Redirect Chain
      </n-button>
    </n-space>

    <c-alert v-if="error" type="error" mb-2>
      {{ error }}
    </c-alert>

    <!-- Warnings -->
    <n-alert v-if="result?.warnings?.length" type="warning" title="Warnings" mb-2>
      <ul>
        <li v-for="w in result.warnings" :key="w">{{ w }}</li>
      </ul>
    </n-alert>

    <c-card title="Summary" v-if="result" mb-2>
      <input-copyable mb-1 label="Input URL:" label-width="100px" label-position="left" :value="result.input_url" />
      <input-copyable mb-1 label="Final URL:" label-width="100px" label-position="left" :value="result.final_url" />
      <input-copyable
        label="Hop Count:"
        label-width="100px"
        label-position="left"
        :value="result.hop_count.toString()"
      />
    </c-card>

    <c-card title="Redirect Chain" v-if="result" mb-2>
      <n-table :bordered="true">
        <thead>
          <tr>
            <th>#</th>
            <th>URL</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Redirect</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="hop in result.chain" :key="hop.index">
            <tr>
              <td>{{ hop.index }}</td>
              <td>{{ hop.url }}</td>
              <td>
                <n-tag
                  :type="
                    hop.status_code >= 400
                      ? 'error'
                      : hop.status_code >= 300 && hop.status_code < 400
                        ? 'warning'
                        : 'success'
                  "
                >
                  {{ hop.status_code }}
                </n-tag>
              </td>
              <td>{{ hop.duration_ms }} ms</td>
              <td>{{ hop.is_redirect ? 'Yes' : 'No' }}</td>
              <td>{{ hop.location || '-' }}</td>
            </tr>
            <tr>
              <td colspan="6">
                <details>
                  <summary>Headers & Body Preview</summary>
                  <textarea-copyable
                    v-if="hop.headers"
                    word-wrap
                    :value="JSON.stringify(hop.headers, null, 2)"
                    language="json"
                    mb-1
                  />
                  <textarea-copyable v-if="hop.body_preview" word-wrap :value="hop.body_preview" mb-1 />
                  <span v-else>-</span>
                  <n-space justify="center">
                    <n-tag v-if="hop.body_truncated" type="warning">Truncated</n-tag>
                  </n-space>
                </details>
              </td>
            </tr>
          </template>
        </tbody>
      </n-table>
    </c-card>
  </div>
</template>
