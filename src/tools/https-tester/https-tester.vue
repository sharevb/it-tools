<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { useNetworkUtilsConfig } from '@/tools/network-utils/network-utils-config';
import { Base64 } from 'js-base64';

const { serverHost, serverAuth, hasFixedConfig } = useNetworkUtilsConfig({
  urlStorageKey: 'https-tester:url',
  authStorageKey: 'https-tester:auth',
});

const loading = ref(false);
const error = ref<string | null>(null);

async function api(path: string, params: Record<string, string | number | boolean> = {}) {
  error.value = null;
  loading.value = true;

  try {
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
  } catch (err: any) {
    error.value = err.toString();
  } finally {
    loading.value = false;
  }
}

type AnyDict = Record<string, any>;

interface CertificateCheckResult {
  ok: boolean;
  hostname: string;
  port: number;
  not_before?: string | null;
  not_after?: string | null;
  days_until_expiry?: number | null;
  subject?: AnyDict | null;
  issuer?: AnyDict | null;
  san?: any[] | null;
  error?: string | null;
}

interface HSTSCheckResult {
  ok: boolean;
  url: string;
  hsts_present: boolean;
  max_age?: number | null;
  include_subdomains: boolean;
  preload: boolean;
  raw_header?: string | null;
  error?: string | null;
}

interface RedirectCheckResult {
  ok: boolean;
  http_url: string;
  redirected: boolean;
  final_url?: string | null;
  status_code?: number | null;
  redirect_chain?: { status_code: number; url: string; headers: Record<string, string> }[] | null;
  error?: string | null;
}

function prettyJSON(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toISOString();
}

const certHost = ref('');
const certPort = ref('443');
const certResult = ref<CertificateCheckResult | null>(null);

const hstsUrl = ref('');
const hstsResult = ref<HSTSCheckResult | null>(null);

const redirectDomain = ref('');
const redirectResult = ref<RedirectCheckResult | null>(null);

// -------------------- Actions --------------------
async function runCertificate() {
  certResult.value = await api('/check-certificate', {
    host: certHost.value,
    port: certPort.value,
  });
}

async function runHsts() {
  hstsResult.value = await api('/check-hsts', { url: hstsUrl.value });
}

async function runRedirect() {
  redirectResult.value = await api('/check-redirect', { domain: redirectDomain.value });
}

const labelProps = {
  'label-position': 'left',
  'label-width': '120px',
};
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
          >{{ t('tools.https-tester.texts.tag-you-must-self-host-network-utilities-service-see')
          }}<c-link href="https://github.com/sharevb/network-utils-ws#running-in-docker" target="_blank">{{
            t('tools.https-tester.texts.tag-network-utilities-service-docker-install')
          }}</c-link>
        </n-p>
      </n-card>
    </details>

    <n-tabs type="line" animated>
      <n-tab-pane name="cert" :tab="t('tools.https-tester.texts.tab-certificate')">
        <c-input-text
          v-model:value="certHost"
          :label="t('tools.https-tester.texts.label-host')"
          v-bind="labelProps"
          :placeholder="t('tools.https-tester.texts.placeholder-example-com')"
          mb-1
        />
        <c-input-text
          v-model:value="certPort"
          :label="t('tools.https-tester.texts.label-port')"
          v-bind="labelProps"
          :placeholder="t('tools.https-tester.texts.placeholder-443')"
          mb-1
        />
        <div mb-2 flex justify-center>
          <n-button type="primary" :loading="loading" @click="runCertificate">{{
            t('tools.https-tester.texts.tag-check-certificate')
          }}</n-button>
        </div>

        <n-card v-if="certResult" :title="t('tools.https-tester.texts.title-result')">
          <n-space justify="center" mb-1>
            <n-tag :type="certResult.ok ? 'success' : 'error'" size="small">
              {{ certResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable
            :label="t('tools.https-tester.texts.label-hostname')"
            v-bind="labelProps"
            :value="certResult.hostname"
            mb-1
          />
          <input-copyable
            :label="t('tools.https-tester.texts.label-port')"
            v-bind="labelProps"
            :value="certResult.port"
            mb-1
          />

          <input-copyable
            :label="t('tools.https-tester.texts.label-not-before')"
            v-bind="labelProps"
            :value="formatDate(certResult.not_before)"
            mb-1
          />

          <input-copyable
            :label="t('tools.https-tester.texts.label-not-after')"
            v-bind="labelProps"
            :value="formatDate(certResult.not_after)"
            mb-1
          />

          <input-copyable
            :label="t('tools.https-tester.texts.label-days-until-expiry')"
            v-bind="labelProps"
            :value="String(certResult.days_until_expiry)"
            mb-1
          />

          <input-copyable
            :label="t('tools.https-tester.texts.label-subject')"
            v-bind="labelProps"
            :value="prettyJSON(certResult.subject)"
            mb-1
          />

          <input-copyable
            :label="t('tools.https-tester.texts.label-issuer')"
            v-bind="labelProps"
            :value="prettyJSON(certResult.issuer)"
            mb-1
          />

          <input-copyable
            v-for="(san, index) in certResult.san"
            :key="index"
            :label="t('tools.https-tester.texts.label-sub-alt-name')"
            v-bind="labelProps"
            :value="prettyJSON(san)"
            mb-1
          />

          <n-alert v-if="certResult.error" type="error" :bordered="false" show-icon>
            {{ certResult.error }}
          </n-alert>
        </n-card>

        <c-alert v-if="error">
          {{ error }}
        </c-alert>
      </n-tab-pane>

      <!-- HSTS -->
      <n-tab-pane name="hsts" :tab="t('tools.https-tester.texts.tab-hsts')">
        <c-input-text
          v-model:value="hstsUrl"
          :label="t('tools.https-tester.texts.label-url')"
          v-bind="labelProps"
          :placeholder="t('tools.https-tester.texts.placeholder-https-example-com')"
          mb-1
        />
        <div mb-2 flex justify-center>
          <n-button type="primary" :loading="loading" @click="runHsts">{{
            t('tools.https-tester.texts.tag-check-hsts')
          }}</n-button>
        </div>

        <n-card v-if="hstsResult" :title="t('tools.https-tester.texts.title-result')">
          <n-space justify="center" mb-1>
            <n-tag :type="hstsResult.ok ? 'success' : 'error'" size="small" mb-1>
              {{ hstsResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable
            :label="t('tools.https-tester.texts.label-url')"
            v-bind="labelProps"
            :value="hstsResult.url"
            mb-1
          />

          <input-copyable
            :label="t('tools.https-tester.texts.label-hsts-present')"
            v-bind="labelProps"
            :value="hstsResult.hsts_present ? 'Yes' : 'No'"
            mb-1
          />

          <input-copyable
            v-if="hstsResult.max_age"
            :label="t('tools.https-tester.texts.label-max-age')"
            v-bind="labelProps"
            :value="String(hstsResult.max_age)"
            mb-1
          />

          <input-copyable
            :label="t('tools.https-tester.texts.label-inc-subdomains')"
            v-bind="labelProps"
            :value="hstsResult.include_subdomains ? 'Yes' : 'No'"
            mb-1
          />

          <input-copyable
            :label="t('tools.https-tester.texts.label-preload')"
            v-bind="labelProps"
            :value="hstsResult.preload ? 'Yes' : 'No'"
            mb-1
          />

          <input-copyable
            v-if="hstsResult.raw_header"
            :label="t('tools.https-tester.texts.label-raw-header')"
            v-bind="labelProps"
            :value="hstsResult.raw_header"
            mb-1
          />

          <n-alert v-if="hstsResult.error" type="error" :bordered="false" show-icon>
            {{ hstsResult.error }}
          </n-alert>
        </n-card>

        <c-alert v-if="error">
          {{ error }}
        </c-alert>
      </n-tab-pane>

      <!-- REDIRECT -->
      <n-tab-pane name="redirect" :tab="t('tools.https-tester.texts.tab-http-https-redirect')">
        <n-form>
          <c-input-text
            v-model:value="redirectDomain"
            :label="t('tools.https-tester.texts.label-domain')"
            v-bind="labelProps"
            :placeholder="t('tools.https-tester.texts.placeholder-example-com')"
            mb-1
          />
          <div mb-2 flex justify-center>
            <n-button type="primary" :loading="loading" @click="runRedirect">{{
              t('tools.https-tester.texts.tag-check-redirect')
            }}</n-button>
          </div>
        </n-form>

        <n-card v-if="redirectResult" :title="t('tools.https-tester.texts.title-result')">
          <n-space justify="center" mb-1>
            <n-tag :type="redirectResult.ok ? 'success' : 'error'" size="small" mb-1>
              {{ redirectResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable
            :label="t('tools.https-tester.texts.label-http-url')"
            v-bind="labelProps"
            :value="redirectResult.http_url"
            mb-1
          />

          <input-copyable
            :label="t('tools.https-tester.texts.label-redirected')"
            v-bind="labelProps"
            :value="redirectResult.redirected ? 'Yes' : 'No'"
            mb-1
          />

          <input-copyable
            :label="t('tools.https-tester.texts.label-final-url')"
            v-bind="labelProps"
            :value="redirectResult.final_url"
            mb-1
          />

          <input-copyable
            :label="t('tools.https-tester.texts.label-status-code')"
            v-bind="labelProps"
            :value="String(redirectResult.status_code)"
            mb-1
          />

          <input-copyable
            v-if="redirectResult.redirect_chain"
            :label="t('tools.https-tester.texts.label-redirect-chain')"
            v-bind="labelProps"
            :value="redirectResult.redirect_chain.map((r) => r.url).join(' → ')"
            mb-1
          />

          <n-card :title="t('tools.https-tester.texts.title-redirect-chain-details')">
            <textarea-copyable
              v-if="redirectResult.redirect_chain"
              :label="t('tools.https-tester.texts.label-redirect-chain')"
              :value="prettyJSON(redirectResult.redirect_chain)"
              mb-1
            />
          </n-card>

          <n-alert v-if="redirectResult.error" type="error" :bordered="false" show-icon>
            {{ redirectResult.error }}
          </n-alert>
        </n-card>

        <c-alert v-if="error">
          {{ error }}
        </c-alert>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
