<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { useNetworkUtilsConfig } from '@/tools/network-utils/network-utils-config';
import { Base64 } from 'js-base64';
import { isIP } from 'is-ip';

const { serverHost, serverAuth, hasFixedConfig } = useNetworkUtilsConfig({
  urlStorageKey: 'dns-tester:url',
  authStorageKey: 'dns-tester:auth',
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

interface DNSQueryResult {
  ok: boolean;
  domain: string;
  record_type: string;
  answers?: string[] | null;
  error?: string | null;
}

interface WhoisResult {
  ok: boolean;
  domain: string;
  raw?: string | null;
  parsed?: AnyDict | null;
  error?: string | null;
}

interface DNSSECResult {
  ok: boolean;
  domain: string;
  validated: boolean;
  dnskey?: string | null;
  rrsig?: string | null;
  error?: string | null;
}

interface ReverseDNSResult {
  ok: boolean;
  ip: string;
  ptr?: string | null;
  error?: string | null;
}

interface AXFRResult {
  ok: boolean;
  domain: string;
  soa?: string | null;
  axfr_allowed: boolean;
  records?: string[] | null;
  error?: string | null;
}

function prettyJSON(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

const dnsTypes = [
  { value: 'A', label: t('tools.dns-tester.texts.label-a-ipv4-address') },
  { value: 'AAAA', label: t('tools.dns-tester.texts.label-aaaa-ipv6-address') },
  { value: 'AFSDB', label: t('tools.dns-tester.texts.label-afsdb-afs-database-location') },
  { value: 'APL', label: t('tools.dns-tester.texts.label-apl-address-prefix-list') },
  { value: 'CAA', label: t('tools.dns-tester.texts.label-caa-certificate-authority-authorization') },
  { value: 'CDNSKEY', label: t('tools.dns-tester.texts.label-cdnskey-child-dnskey') },
  { value: 'CDS', label: t('tools.dns-tester.texts.label-cds-child-ds') },
  { value: 'CERT', label: t('tools.dns-tester.texts.label-cert-certificate-storage') },
  { value: 'CNAME', label: t('tools.dns-tester.texts.label-cname-canonical-name') },
  { value: 'CSYNC', label: t('tools.dns-tester.texts.label-csync-child-to-parent-sync') },
  { value: 'DHCID', label: t('tools.dns-tester.texts.label-dhcid-dhcp-identifier') },
  { value: 'DLV', label: t('tools.dns-tester.texts.label-dlv-dnssec-lookaside-validation-obsolete') },
  { value: 'DNAME', label: t('tools.dns-tester.texts.label-dname-non-terminal-rename') },
  { value: 'DNSKEY', label: t('tools.dns-tester.texts.label-dnskey-dnssec-public-key') },
  { value: 'DS', label: t('tools.dns-tester.texts.label-ds-delegation-signer') },
  { value: 'EUI48', label: t('tools.dns-tester.texts.label-eui48-mac-address-48-bit') },
  { value: 'EUI64', label: t('tools.dns-tester.texts.label-eui64-mac-address-64-bit') },
  { value: 'HINFO', label: t('tools.dns-tester.texts.label-hinfo-host-information') },
  { value: 'HIP', label: t('tools.dns-tester.texts.label-hip-host-identity-protocol') },
  { value: 'HTTPS', label: t('tools.dns-tester.texts.label-https-https-service-binding') },
  { value: 'IPSECKEY', label: t('tools.dns-tester.texts.label-ipseckey-ipsec-key') },
  { value: 'KEY', label: t('tools.dns-tester.texts.label-key-security-key-obsolete') },
  { value: 'KX', label: t('tools.dns-tester.texts.label-kx-key-exchanger') },
  { value: 'LOC', label: t('tools.dns-tester.texts.label-loc-geographic-location') },
  { value: 'MX', label: t('tools.dns-tester.texts.label-mx-mail-exchanger') },
  { value: 'NAPTR', label: t('tools.dns-tester.texts.label-naptr-regex-based-rewrite') },
  { value: 'NS', label: t('tools.dns-tester.texts.label-ns-name-server') },
  { value: 'NSEC', label: t('tools.dns-tester.texts.label-nsec-dnssec-denial-of-existence') },
  { value: 'NSEC3', label: t('tools.dns-tester.texts.label-nsec3-hashed-denial-of-existence') },
  { value: 'NSEC3PARAM', label: t('tools.dns-tester.texts.label-nsec3param-nsec3-parameters') },
  { value: 'OPENPGPKEY', label: t('tools.dns-tester.texts.label-openpgpkey-openpgp-public-key') },
  { value: 'PTR', label: t('tools.dns-tester.texts.label-ptr-reverse-lookup-pointer') },
  { value: 'RRSIG', label: t('tools.dns-tester.texts.label-rrsig-dnssec-signature') },
  { value: 'RP', label: t('tools.dns-tester.texts.label-rp-responsible-person') },
  { value: 'SIG', label: t('tools.dns-tester.texts.label-sig-signature-obsolete') },
  { value: 'SMIMEA', label: t('tools.dns-tester.texts.label-smimea-s-mime-cert-association') },
  { value: 'SOA', label: t('tools.dns-tester.texts.label-soa-start-of-authority') },
  { value: 'SPF', label: t('tools.dns-tester.texts.label-spf-sender-policy-framework-deprecated') },
  { value: 'SRV', label: t('tools.dns-tester.texts.label-srv-service-locator') },
  { value: 'SSHFP', label: t('tools.dns-tester.texts.label-sshfp-ssh-public-key-fingerprint') },
  { value: 'SVCB', label: t('tools.dns-tester.texts.label-svcb-service-binding') },
  { value: 'TA', label: t('tools.dns-tester.texts.label-ta-trust-anchor-experimental') },
  { value: 'TKEY', label: t('tools.dns-tester.texts.label-tkey-secret-key-agreement') },
  { value: 'TLSA', label: t('tools.dns-tester.texts.label-tlsa-dane-tls-association') },
  { value: 'TSIG', label: t('tools.dns-tester.texts.label-tsig-transaction-signature') },
  { value: 'TXT', label: t('tools.dns-tester.texts.label-txt-text-record') },
  { value: 'URI', label: t('tools.dns-tester.texts.label-uri-uri-template') },
  { value: 'ZONEMD', label: t('tools.dns-tester.texts.label-zonemd-zone-message-digest') },
];

const resolverOptions = [
  { label: t('tools.dns-tester.texts.label-system-default'), value: '' },
  { label: t('tools.dns-tester.texts.label-custom-dns-resolver'), value: '__custom__' },
  { label: t('tools.dns-tester.texts.label-google-8-8-8-8'), value: '8.8.8.8' },
  { label: t('tools.dns-tester.texts.label-google-8-8-4-4'), value: '8.8.4.4' },
  { label: t('tools.dns-tester.texts.label-cloudflare-1-1-1-1'), value: '1.1.1.1' },
  { label: t('tools.dns-tester.texts.label-cloudflare-1-0-0-1'), value: '1.0.0.1' },
  { label: t('tools.dns-tester.texts.label-quad9-9-9-9-9'), value: '9.9.9.9' },
  { label: t('tools.dns-tester.texts.label-quad9-149-112-112-112'), value: '149.112.112.112' },
  { label: t('tools.dns-tester.texts.label-opendns-208-67-222-222'), value: '208.67.222.222' },
  { label: t('tools.dns-tester.texts.label-opendns-208-67-220-220'), value: '208.67.220.220' },
  { label: t('tools.dns-tester.texts.label-cleanbrowsing-185-228-168-9'), value: '185.228.168.9' },
  { label: t('tools.dns-tester.texts.label-cleanbrowsing-185-228-169-9'), value: '185.228.169.9' },
  { label: t('tools.dns-tester.texts.label-dns-watch-84-200-69-80'), value: '84.200.69.80' },
  { label: t('tools.dns-tester.texts.label-dns-watch-84-200-70-40'), value: '84.200.70.40' },
  { label: t('tools.dns-tester.texts.label-freedns-37-235-1-174'), value: '37.235.1.174' },
  { label: t('tools.dns-tester.texts.label-freedns-37-235-1-177'), value: '37.235.1.177' },
  { label: t('tools.dns-tester.texts.label-fdn-france-80-67-169-12'), value: '80.67.169.12' },
  { label: t('tools.dns-tester.texts.label-fdn-france-80-67-169-40'), value: '80.67.169.40' },
  { label: t('tools.dns-tester.texts.label-neustar-eu-156-154-70-1'), value: '156.154.70.1' },
  { label: t('tools.dns-tester.texts.label-neustar-eu-156-154-71-1'), value: '156.154.71.1' },
  { label: t('tools.dns-tester.texts.label-level3-209-244-0-3'), value: '209.244.0.3' },
  { label: t('tools.dns-tester.texts.label-level3-209-244-0-4'), value: '209.244.0.4' },
  { label: t('tools.dns-tester.texts.label-comodo-8-26-56-26'), value: '8.26.56.26' },
  { label: t('tools.dns-tester.texts.label-comodo-8-20-247-20'), value: '8.20.247.20' },
  { label: t('tools.dns-tester.texts.label-centurylink-205-171-3-65'), value: '205.171.3.65' },
  { label: t('tools.dns-tester.texts.label-centurylink-205-171-2-65'), value: '205.171.2.65' },
  { label: t('tools.dns-tester.texts.label-dnspod-119-29-29-29'), value: '119.29.29.29' },
  { label: t('tools.dns-tester.texts.label-alidns-223-5-5-5'), value: '223.5.5.5' },
  { label: t('tools.dns-tester.texts.label-alidns-223-6-6-6'), value: '223.6.6.6' },
  { label: t('tools.dns-tester.texts.label-yandex-77-88-8-8'), value: '77.88.8.8' },
  { label: t('tools.dns-tester.texts.label-yandex-77-88-8-1'), value: '77.88.8.1' },
  { label: t('tools.dns-tester.texts.label-naver-korea-125-209-222-141'), value: '125.209.222.141' },
  { label: t('tools.dns-tester.texts.label-naver-korea-125-209-249-1'), value: '125.209.249.1' },
  { label: t('tools.dns-tester.texts.label-gigadns-brazil-189-38-95-95'), value: '189.38.95.95' },
  { label: t('tools.dns-tester.texts.label-gigadns-brazil-189-38-95-96'), value: '189.38.95.96' },
  { label: t('tools.dns-tester.texts.label-opendns-africa-196-3-132-153'), value: '196.3.132.153' },
  { label: t('tools.dns-tester.texts.label-opendns-africa-196-3-132-154'), value: '196.3.132.154' },
];

const resolverIP = ref('');
const customResolverIP = ref('');
const effectiveResolverIP = computed(() =>
  resolverIP.value === '__custom__' ? customResolverIP.value.trim() : resolverIP.value,
);
const customResolverIpError = computed(() => {
  if (resolverIP.value !== '__custom__' || !customResolverIP.value.trim()) {
    return '';
  }

  return isIP(customResolverIP.value.trim()) ? '' : 'Please enter a valid IPv4 or IPv6 address.';
});
const canRunWithSelectedResolver = computed(
  () => resolverIP.value !== '__custom__' || customResolverIpError.value === '',
);

const dnsDomain = ref('');
const dnsType = ref('A');
const dnsResult = ref<DNSQueryResult | null>(null);

const whoisDomain = ref('');
const whoisResult = ref<WhoisResult | null>(null);

const dnssecDomain = ref('');
const dnssecResult = ref<DNSSECResult | null>(null);

const reverseIp = ref('');
const reverseResult = ref<ReverseDNSResult | null>(null);

const axfrDomain = ref('');
const axfrResult = ref<AXFRResult | null>(null);

async function runDns() {
  dnsResult.value = await api('/dns-query', {
    domain: dnsDomain.value,
    record_type: dnsType.value,
    resolver_ip: effectiveResolverIP.value,
  });
}

async function runWhois() {
  whoisResult.value = await api('/whois', { domain: whoisDomain.value });
}

async function runDnssec() {
  dnssecResult.value = await api('/dnssec', {
    domain: dnssecDomain.value,
    resolver_ip: effectiveResolverIP.value,
  });
}

async function runReverse() {
  reverseResult.value = await api('/reverse-dns', {
    ip: reverseIp.value,
    resolver_ip: effectiveResolverIP.value,
  });
}

async function runAxfr() {
  axfrResult.value = await api('/soa-axfr', {
    domain: axfrDomain.value,
    resolver_ip: effectiveResolverIP.value,
  });
}

const labelProps = {
  'label-position': 'left',
  'label-width': '150px',
};
</script>

<template>
  <div style="min-height: 80vh">
    <details v-if="!hasFixedConfig" mb-2>
      <summary>
        ⚠ {{ t('tools.external-self-hosted-required') }} ⚠ -
        {{ t('tools.dns-tester.texts.tag-network-utilities-service-configuration-self-hosted') }}
      </summary>
      <n-card>
        <NFormItem :label="t('tools.dns-tester.texts.label-network-utilities-service-url')" label-placement="top">
          <NInput
            v-model:value="serverHost"
            :placeholder="t('tools.dns-tester.texts.placeholder-http-localhost-3000')"
          />
        </NFormItem>
        <NFormItem
          :label="t('tools.dns-tester.texts.label-basic-authentication')"
          label-placement="left"
          label-width="auto"
        >
          <NInput v-model:value="serverAuth" :placeholder="t('tools.dns-tester.texts.placeholder-username-password')" />
        </NFormItem>
        <n-p
          >{{ t('tools.dns-tester.texts.tag-you-must-self-host-network-utilities-service-see')
          }}<c-link href="https://github.com/sharevb/network-utils-ws#running-in-docker" target="_blank">{{
            t('tools.dns-tester.texts.tag-network-utilities-service-docker-install')
          }}</c-link>
        </n-p>
      </n-card>
    </details>

    <NFormItem :label="t('tools.dns-tester.texts.label-target-dns-resolver-ip')" label-placement="left">
      <div style="width: 100%">
        <NSelect
          v-model:value="resolverIP"
          :options="resolverOptions"
          :placeholder="t('tools.dns-tester.texts.placeholder-system-default')"
          filterable
          clearable
          mb-1
        />
        <NInput
          v-if="resolverIP === '__custom__'"
          v-model:value="customResolverIP"
          :placeholder="t('tools.dns-tester.texts.placeholder-e-g-10-0-0-53')"
        />
        <div v-if="customResolverIpError" style="margin-top: 6px; color: var(--n-error-color); font-size: 12px">
          {{ customResolverIpError }}
        </div>
      </div>
    </NFormItem>

    <n-tabs type="line" animated>
      <!-- DNS QUERY -->
      <n-tab-pane name="dns" :tab="t('tools.dns-tester.texts.tab-dns-query')" style="min-height: 80vh">
        <c-input-text
          v-model:value="dnsDomain"
          :label="t('tools.dns-tester.texts.label-domain')"
          v-bind="labelProps"
          :placeholder="t('tools.dns-tester.texts.placeholder-example-com')"
          mb-1
        />
        <c-select
          v-model:value="dnsType"
          :label="t('tools.dns-tester.texts.label-dns-record-type')"
          v-bind="labelProps"
          :options="dnsTypes"
          mb-1
        />
        <div mb-2 flex justify-center>
          <n-button :loading="loading" :disabled="!canRunWithSelectedResolver" @click="runDns">{{
            t('tools.dns-tester.texts.tag-query-dns')
          }}</n-button>
        </div>

        <n-card v-if="dnsResult" :title="t('tools.dns-tester.texts.title-result')">
          <n-space justify="center" mb-1>
            <n-tag :type="dnsResult.ok ? 'success' : 'error'" size="small">
              {{ dnsResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable
            :label="t('tools.dns-tester.texts.label-domain')"
            v-bind="labelProps"
            :value="dnsResult.domain"
            mb-1
          />
          <input-copyable
            :label="t('tools.dns-tester.texts.label-record-type')"
            v-bind="labelProps"
            :value="dnsResult.record_type"
            mb-1
          />

          <n-card v-if="dnsResult.answers" :title="t('tools.dns-tester.texts.title-answers')" mb-1>
            <textarea-copyable v-if="dnsResult.answers" :value="dnsResult.answers.join('\n')" mb-1 />
          </n-card>

          <n-alert v-if="dnsResult.error" type="error" :bordered="false" show-icon>
            {{ dnsResult.error }}
          </n-alert>
        </n-card>

        <c-alert v-if="error">
          {{ error }}
        </c-alert>
      </n-tab-pane>

      <!-- WHOIS -->
      <n-tab-pane name="whois" :tab="t('tools.dns-tester.texts.tab-whois')">
        <c-input-text
          v-model:value="whoisDomain"
          :label="t('tools.dns-tester.texts.label-domain')"
          v-bind="labelProps"
          :placeholder="t('tools.dns-tester.texts.placeholder-example-com')"
          mb-1
        />
        <div mb-2 flex justify-center>
          <n-button type="primary" :loading="loading" @click="runWhois">{{
            t('tools.dns-tester.texts.tag-lookup-whois')
          }}</n-button>
        </div>

        <n-card v-if="whoisResult" :title="t('tools.dns-tester.texts.title-result')">
          <n-space justify="center" mb-1>
            <n-tag :type="whoisResult.ok ? 'success' : 'error'" size="small" mb-1>
              {{ whoisResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable
            :label="t('tools.dns-tester.texts.label-domain')"
            v-bind="labelProps"
            :value="whoisResult.domain"
            mb-1
          />

          <textarea-copyable
            v-if="whoisResult.raw"
            :label="t('tools.dns-tester.texts.label-raw-whois')"
            :value="whoisResult.raw"
            mb-1
          />

          <CodeBlockCopyable
            v-if="whoisResult.parsed"
            :label="t('tools.dns-tester.texts.label-parsed')"
            :value="prettyJSON(whoisResult.parsed)"
            language="json"
            mb-1
          />

          <n-alert v-if="whoisResult.error" type="error" :bordered="false" show-icon>
            {{ whoisResult.error }}
          </n-alert>
        </n-card>

        <c-alert v-if="error">
          {{ error }}
        </c-alert>
      </n-tab-pane>

      <!-- DNSSEC -->
      <n-tab-pane name="dnssec" :tab="t('tools.dns-tester.texts.tab-dnssec-validation')">
        <c-input-text
          v-model:value="dnssecDomain"
          :label="t('tools.dns-tester.texts.label-domain')"
          v-bind="labelProps"
          :placeholder="t('tools.dns-tester.texts.placeholder-example-com')"
          mb-1
        />
        <div mb-2 flex justify-center>
          <n-button type="primary" :loading="loading" :disabled="!canRunWithSelectedResolver" @click="runDnssec">{{
            t('tools.dns-tester.texts.tag-validate-dnssec')
          }}</n-button>
        </div>

        <n-card v-if="dnssecResult" :title="t('tools.dns-tester.texts.title-result')">
          <n-space justify="center" mb-1>
            <n-tag :type="dnssecResult.ok ? 'success' : 'error'" size="small" mb-1>
              {{ dnssecResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable
            :label="t('tools.dns-tester.texts.label-domain')"
            v-bind="labelProps"
            :value="dnssecResult.domain"
            mb-1
          />

          <input-copyable
            :label="t('tools.dns-tester.texts.label-validated')"
            v-bind="labelProps"
            :value="dnssecResult.validated ? 'Yes' : 'No'"
            mb-1
          />

          <input-copyable
            v-if="dnssecResult.dnskey"
            :label="t('tools.dns-tester.texts.label-dnskey')"
            v-bind="labelProps"
            :value="dnssecResult.dnskey"
            mb-1
          />

          <input-copyable
            v-if="dnssecResult.rrsig"
            :label="t('tools.dns-tester.texts.label-rrsig')"
            v-bind="labelProps"
            :value="dnssecResult.rrsig"
            mb-1
          />

          <n-alert v-if="dnssecResult.error" type="error" :bordered="false" show-icon>
            {{ dnssecResult.error }}
          </n-alert>
        </n-card>

        <c-alert v-if="error">
          {{ error }}
        </c-alert>
      </n-tab-pane>

      <!-- REVERSE DNS -->
      <n-tab-pane name="reverse" :tab="t('tools.dns-tester.texts.tab-reverse-dns-ptr')">
        <c-input-text
          v-model:value="reverseIp"
          :label="t('tools.dns-tester.texts.label-ip-address')"
          v-bind="labelProps"
          :placeholder="t('tools.dns-tester.texts.placeholder-8-8-8-8')"
          mb-1
        />
        <div mb-2 flex justify-center>
          <n-button type="primary" :loading="loading" :disabled="!canRunWithSelectedResolver" @click="runReverse">{{
            t('tools.dns-tester.texts.tag-reverse-lookup')
          }}</n-button>
        </div>

        <n-card v-if="reverseResult" :title="t('tools.dns-tester.texts.title-result')">
          <n-space justify="center" mb-1>
            <n-tag :type="reverseResult.ok ? 'success' : 'error'" size="small" mb-1>
              {{ reverseResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable
            :label="t('tools.dns-tester.texts.label-ip')"
            v-bind="labelProps"
            :value="reverseResult.ip"
            mb-1
          />

          <input-copyable
            v-if="reverseResult.ptr"
            :label="t('tools.dns-tester.texts.label-ptr')"
            v-bind="labelProps"
            :value="reverseResult.ptr"
            mb-1
          />

          <n-alert v-if="reverseResult.error" type="error" :bordered="false" show-icon>
            {{ reverseResult.error }}
          </n-alert>
        </n-card>

        <c-alert v-if="error">
          {{ error }}
        </c-alert>
      </n-tab-pane>

      <!-- SOA + AXFR -->
      <n-tab-pane name="axfr" :tab="t('tools.dns-tester.texts.tab-soa-axfr-test')">
        <c-input-text
          v-model:value="axfrDomain"
          :label="t('tools.dns-tester.texts.label-domain')"
          v-bind="labelProps"
          :placeholder="t('tools.dns-tester.texts.placeholder-example-com')"
          mb-1
        />
        <div mb-2 flex justify-center>
          <n-button type="primary" :loading="loading" :disabled="!canRunWithSelectedResolver" @click="runAxfr">{{
            t('tools.dns-tester.texts.tag-run-soa-axfr')
          }}</n-button>
        </div>

        <n-card v-if="axfrResult" :title="t('tools.dns-tester.texts.title-result')">
          <n-space justify="center" mb-1>
            <n-tag :type="axfrResult.ok ? 'success' : 'error'" size="small" mb-1>
              {{ axfrResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable
            :label="t('tools.dns-tester.texts.label-domain')"
            v-bind="labelProps"
            :value="axfrResult.domain"
            mb-1
          />

          <textarea-copyable
            v-if="axfrResult.soa"
            :label="t('tools.dns-tester.texts.label-soa')"
            :value="axfrResult.soa"
            mb-1
          />

          <input-copyable
            :label="t('tools.dns-tester.texts.label-axfr-allowed')"
            v-bind="labelProps"
            :value="axfrResult.axfr_allowed ? 'Yes' : 'No'"
            mb-1
          />

          <textarea-copyable
            v-if="axfrResult.records"
            :label="t('tools.dns-tester.texts.label-records')"
            :value="axfrResult.records.join('\n')"
            mb-1
          />

          <n-alert v-if="axfrResult.error" type="error" :bordered="false" show-icon>
            {{ axfrResult.error }}
          </n-alert>
        </n-card>

        <c-alert v-if="error">
          {{ error }}
        </c-alert>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
