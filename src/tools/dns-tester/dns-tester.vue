<script setup lang="ts">
import { useNetworkUtilsConfig } from '@/tools/network-utils/network-utils-config';
import { Base64 } from 'js-base64';
import { isIP } from 'is-ip';

const { serverHost, serverAuth, hasFixedConfig } = useNetworkUtilsConfig({
  toolKey: 'dns-tester',
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
  catch (err: any) {
    error.value = err.toString();
  }
  finally {
    loading.value = false;
  }
}

type AnyDict = Record<string, any>;

interface DNSQueryResult {
  ok: boolean
  domain: string
  record_type: string
  answers?: string[] | null
  error?: string | null
}

interface WhoisResult {
  ok: boolean
  domain: string
  raw?: string | null
  parsed?: AnyDict | null
  error?: string | null
}

interface DNSSECResult {
  ok: boolean
  domain: string
  validated: boolean
  dnskey?: string | null
  rrsig?: string | null
  error?: string | null
}

interface ReverseDNSResult {
  ok: boolean
  ip: string
  ptr?: string | null
  error?: string | null
}

interface AXFRResult {
  ok: boolean
  domain: string
  soa?: string | null
  axfr_allowed: boolean
  records?: string[] | null
  error?: string | null
}

function prettyJSON(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  }
  catch {
    return String(value);
  }
}

const dnsTypes = [
  { value: 'A', label: 'A — IPv4 address' },
  { value: 'AAAA', label: 'AAAA — IPv6 address' },
  { value: 'AFSDB', label: 'AFSDB — AFS database location' },
  { value: 'APL', label: 'APL — Address prefix list' },
  { value: 'CAA', label: 'CAA — Certificate Authority Authorization' },
  { value: 'CDNSKEY', label: 'CDNSKEY — Child DNSKEY' },
  { value: 'CDS', label: 'CDS — Child DS' },
  { value: 'CERT', label: 'CERT — Certificate storage' },
  { value: 'CNAME', label: 'CNAME — Canonical name' },
  { value: 'CSYNC', label: 'CSYNC — Child-to-parent sync' },
  { value: 'DHCID', label: 'DHCID — DHCP identifier' },
  { value: 'DLV', label: 'DLV — DNSSEC Lookaside Validation (obsolete)' },
  { value: 'DNAME', label: 'DNAME — Non-terminal rename' },
  { value: 'DNSKEY', label: 'DNSKEY — DNSSEC public key' },
  { value: 'DS', label: 'DS — Delegation signer' },
  { value: 'EUI48', label: 'EUI48 — MAC address (48-bit)' },
  { value: 'EUI64', label: 'EUI64 — MAC address (64-bit)' },
  { value: 'HINFO', label: 'HINFO — Host information' },
  { value: 'HIP', label: 'HIP — Host identity protocol' },
  { value: 'HTTPS', label: 'HTTPS — HTTPS service binding' },
  { value: 'IPSECKEY', label: 'IPSECKEY — IPsec key' },
  { value: 'KEY', label: 'KEY — Security key (obsolete)' },
  { value: 'KX', label: 'KX — Key exchanger' },
  { value: 'LOC', label: 'LOC — Geographic location' },
  { value: 'MX', label: 'MX — Mail exchanger' },
  { value: 'NAPTR', label: 'NAPTR — Regex-based rewrite' },
  { value: 'NS', label: 'NS — Name server' },
  { value: 'NSEC', label: 'NSEC — DNSSEC denial of existence' },
  { value: 'NSEC3', label: 'NSEC3 — Hashed denial of existence' },
  { value: 'NSEC3PARAM', label: 'NSEC3PARAM — NSEC3 parameters' },
  { value: 'OPENPGPKEY', label: 'OPENPGPKEY — OpenPGP public key' },
  { value: 'PTR', label: 'PTR — Reverse lookup pointer' },
  { value: 'RRSIG', label: 'RRSIG — DNSSEC signature' },
  { value: 'RP', label: 'RP — Responsible person' },
  { value: 'SIG', label: 'SIG — Signature (obsolete)' },
  { value: 'SMIMEA', label: 'SMIMEA — S/MIME cert association' },
  { value: 'SOA', label: 'SOA — Start of authority' },
  { value: 'SPF', label: 'SPF — Sender Policy Framework (deprecated)' },
  { value: 'SRV', label: 'SRV — Service locator' },
  { value: 'SSHFP', label: 'SSHFP — SSH public key fingerprint' },
  { value: 'SVCB', label: 'SVCB — Service binding' },
  { value: 'TA', label: 'TA — Trust anchor (experimental)' },
  { value: 'TKEY', label: 'TKEY — Secret key agreement' },
  { value: 'TLSA', label: 'TLSA — DANE TLS association' },
  { value: 'TSIG', label: 'TSIG — Transaction signature' },
  { value: 'TXT', label: 'TXT — Text record' },
  { value: 'URI', label: 'URI — URI template' },
  { value: 'ZONEMD', label: 'ZONEMD — Zone message digest' },
];

const resolverOptions = [
  { label: 'System default', value: '' },
  { label: 'Custom DNS Resolver', value: '__custom__' },
  { label: 'Google 8.8.8.8', value: '8.8.8.8' },
  { label: 'Google 8.8.4.4', value: '8.8.4.4' },
  { label: 'Cloudflare 1.1.1.1', value: '1.1.1.1' },
  { label: 'Cloudflare 1.0.0.1', value: '1.0.0.1' },
  { label: 'Quad9 9.9.9.9', value: '9.9.9.9' },
  { label: 'Quad9 149.112.112.112', value: '149.112.112.112' },
  { label: 'OpenDNS 208.67.222.222', value: '208.67.222.222' },
  { label: 'OpenDNS 208.67.220.220', value: '208.67.220.220' },
  { label: 'CleanBrowsing 185.228.168.9', value: '185.228.168.9' },
  { label: 'CleanBrowsing 185.228.169.9', value: '185.228.169.9' },
  { label: 'DNS.Watch 84.200.69.80', value: '84.200.69.80' },
  { label: 'DNS.Watch 84.200.70.40', value: '84.200.70.40' },
  { label: 'FreeDNS 37.235.1.174', value: '37.235.1.174' },
  { label: 'FreeDNS 37.235.1.177', value: '37.235.1.177' },
  { label: 'FDN France 80.67.169.12', value: '80.67.169.12' },
  { label: 'FDN France 80.67.169.40', value: '80.67.169.40' },
  { label: 'Neustar EU 156.154.70.1', value: '156.154.70.1' },
  { label: 'Neustar EU 156.154.71.1', value: '156.154.71.1' },
  { label: 'Level3 209.244.0.3', value: '209.244.0.3' },
  { label: 'Level3 209.244.0.4', value: '209.244.0.4' },
  { label: 'Comodo 8.26.56.26', value: '8.26.56.26' },
  { label: 'Comodo 8.20.247.20', value: '8.20.247.20' },
  { label: 'CenturyLink 205.171.3.65', value: '205.171.3.65' },
  { label: 'CenturyLink 205.171.2.65', value: '205.171.2.65' },
  { label: 'DNSPod 119.29.29.29', value: '119.29.29.29' },
  { label: 'AliDNS 223.5.5.5', value: '223.5.5.5' },
  { label: 'AliDNS 223.6.6.6', value: '223.6.6.6' },
  { label: 'Yandex 77.88.8.8', value: '77.88.8.8' },
  { label: 'Yandex 77.88.8.1', value: '77.88.8.1' },
  { label: 'Naver Korea 125.209.222.141', value: '125.209.222.141' },
  { label: 'Naver Korea 125.209.249.1', value: '125.209.249.1' },
  { label: 'GigaDNS Brazil 189.38.95.95', value: '189.38.95.95' },
  { label: 'GigaDNS Brazil 189.38.95.96', value: '189.38.95.96' },
  { label: 'OpenDNS Africa 196.3.132.153', value: '196.3.132.153' },
  { label: 'OpenDNS Africa 196.3.132.154', value: '196.3.132.154' },
];

const resolverIP = ref('');
const customResolverIP = ref('');
const effectiveResolverIP = computed(() => resolverIP.value === '__custom__' ? customResolverIP.value.trim() : resolverIP.value);
const customResolverIpError = computed(() => {
  if (resolverIP.value !== '__custom__' || !customResolverIP.value.trim()) {
    return '';
  }

  return isIP(customResolverIP.value.trim()) ? '' : 'Please enter a valid IPv4 or IPv6 address.';
});
const canRunWithSelectedResolver = computed(() => resolverIP.value !== '__custom__' || customResolverIpError.value === '');

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
  <div style="min-height: 80vh;">
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

    <NFormItem label="Target DNS Resolver IP:" label-placement="left">
      <div style="width: 100%;">
        <NSelect
          v-model:value="resolverIP"
          :options="resolverOptions"
          placeholder="System default"
          filterable
          clearable
          mb-1
        />
        <NInput
          v-if="resolverIP === '__custom__'"
          v-model:value="customResolverIP"
          placeholder="e.g. 10.0.0.53"
        />
        <div v-if="customResolverIpError" style="margin-top: 6px; color: var(--n-error-color); font-size: 12px;">
          {{ customResolverIpError }}
        </div>
      </div>
    </NFormItem>

    <n-tabs type="line" animated>
      <!-- DNS QUERY -->
      <n-tab-pane name="dns" tab="DNS Query" style="min-height: 80vh;">
        <c-input-text v-model:value="dnsDomain" label="Domain:" v-bind="labelProps" placeholder="example.com" mb-1 />
        <c-select
          v-model:value="dnsType"
          label="DNS Record type:"
          v-bind="labelProps"
          :options="dnsTypes"
          mb-1
        />
        <div mb-2 flex justify-center>
          <n-button :loading="loading" :disabled="!canRunWithSelectedResolver" @click="runDns">
            Query DNS
          </n-button>
        </div>

        <n-card v-if="dnsResult" title="Result">
          <n-space justify="center" mb-1>
            <n-tag :type="dnsResult.ok ? 'success' : 'error'" size="small">
              {{ dnsResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable label="Domain" v-bind="labelProps" :value="dnsResult.domain" mb-1 />
          <input-copyable label="Record type" v-bind="labelProps" :value="dnsResult.record_type" mb-1 />

          <n-card v-if="dnsResult.answers" title="Answers" mb-1>
            <textarea-copyable
              v-if="dnsResult.answers"
              :value="dnsResult.answers.join('\n')"
              mb-1
            />
          </n-card>

          <n-alert
            v-if="dnsResult.error"
            type="error"
            :bordered="false"
            show-icon
          >
            {{ dnsResult.error }}
          </n-alert>
        </n-card>

        <c-alert v-if="error">
          {{ error }}
        </c-alert>
      </n-tab-pane>

      <!-- WHOIS -->
      <n-tab-pane name="whois" tab="WHOIS">
        <c-input-text v-model:value="whoisDomain" label="Domain:" v-bind="labelProps" placeholder="example.com" mb-1 />
        <div mb-2 flex justify-center>
          <n-button type="primary" :loading="loading" @click="runWhois">
            Lookup WHOIS
          </n-button>
        </div>

        <n-card v-if="whoisResult" title="Result">
          <n-space justify="center" mb-1>
            <n-tag :type="whoisResult.ok ? 'success' : 'error'" size="small" mb-1>
              {{ whoisResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable label="Domain" v-bind="labelProps" :value="whoisResult.domain" mb-1 />

          <textarea-copyable
            v-if="whoisResult.raw"
            label="Raw WHOIS"
            :value="whoisResult.raw"
            mb-1
          />

          <CodeBlockCopyable
            v-if="whoisResult.parsed"
            label="Parsed"
            :value="prettyJSON(whoisResult.parsed)"
            language="json"
            mb-1
          />

          <n-alert
            v-if="whoisResult.error"
            type="error"
            :bordered="false"
            show-icon
          >
            {{ whoisResult.error }}
          </n-alert>
        </n-card>

        <c-alert v-if="error">
          {{ error }}
        </c-alert>
      </n-tab-pane>

      <!-- DNSSEC -->
      <n-tab-pane name="dnssec" tab="DNSSEC Validation">
        <c-input-text v-model:value="dnssecDomain" label="Domain:" v-bind="labelProps" placeholder="example.com" mb-1 />
        <div mb-2 flex justify-center>
          <n-button type="primary" :loading="loading" :disabled="!canRunWithSelectedResolver" @click="runDnssec">
            Validate DNSSEC
          </n-button>
        </div>

        <n-card v-if="dnssecResult" title="Result">
          <n-space justify="center" mb-1>
            <n-tag :type="dnssecResult.ok ? 'success' : 'error'" size="small" mb-1>
              {{ dnssecResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable label="Domain" v-bind="labelProps" :value="dnssecResult.domain" mb-1 />

          <input-copyable
            label="Validated"
            v-bind="labelProps"
            :value="dnssecResult.validated ? 'Yes' : 'No'"
            mb-1
          />

          <input-copyable
            v-if="dnssecResult.dnskey"
            label="DNSKEY"
            v-bind="labelProps"
            :value="dnssecResult.dnskey"
            mb-1
          />

          <input-copyable
            v-if="dnssecResult.rrsig"
            label="RRSIG"
            v-bind="labelProps"
            :value="dnssecResult.rrsig"
            mb-1
          />

          <n-alert
            v-if="dnssecResult.error"
            type="error"
            :bordered="false"
            show-icon
          >
            {{ dnssecResult.error }}
          </n-alert>
        </n-card>

        <c-alert v-if="error">
          {{ error }}
        </c-alert>
      </n-tab-pane>

      <!-- REVERSE DNS -->
      <n-tab-pane name="reverse" tab="Reverse DNS (PTR)">
        <c-input-text v-model:value="reverseIp" label="IP Address:" v-bind="labelProps" placeholder="8.8.8.8" mb-1 />
        <div mb-2 flex justify-center>
          <n-button type="primary" :loading="loading" :disabled="!canRunWithSelectedResolver" @click="runReverse">
            Reverse Lookup
          </n-button>
        </div>

        <n-card v-if="reverseResult" title="Result">
          <n-space justify="center" mb-1>
            <n-tag :type="reverseResult.ok ? 'success' : 'error'" size="small" mb-1>
              {{ reverseResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable label="IP" v-bind="labelProps" :value="reverseResult.ip" mb-1 />

          <input-copyable
            v-if="reverseResult.ptr"
            label="PTR"
            v-bind="labelProps"
            :value="reverseResult.ptr"
            mb-1
          />

          <n-alert
            v-if="reverseResult.error"
            type="error"
            :bordered="false"
            show-icon
          >
            {{ reverseResult.error }}
          </n-alert>
        </n-card>

        <c-alert v-if="error">
          {{ error }}
        </c-alert>
      </n-tab-pane>

      <!-- SOA + AXFR -->
      <n-tab-pane name="axfr" tab="SOA + AXFR Test">
        <c-input-text v-model:value="axfrDomain" label="Domain:" v-bind="labelProps" placeholder="example.com" mb-1 />
        <div mb-2 flex justify-center>
          <n-button type="primary" :loading="loading" :disabled="!canRunWithSelectedResolver" @click="runAxfr">
            Run SOA + AXFR
          </n-button>
        </div>

        <n-card v-if="axfrResult" title="Result">
          <n-space justify="center" mb-1>
            <n-tag :type="axfrResult.ok ? 'success' : 'error'" size="small" mb-1>
              {{ axfrResult.ok ? 'OK' : 'FAILED' }}
            </n-tag>
          </n-space>

          <input-copyable label="Domain" v-bind="labelProps" :value="axfrResult.domain" mb-1 />

          <textarea-copyable
            v-if="axfrResult.soa"
            label="SOA"
            :value="axfrResult.soa"
            mb-1
          />

          <input-copyable
            label="AXFR allowed"
            v-bind="labelProps"
            :value="axfrResult.axfr_allowed ? 'Yes' : 'No'"
            mb-1
          />

          <textarea-copyable
            v-if="axfrResult.records"
            label="Records"
            :value="axfrResult.records.join('\n')"
            mb-1
          />

          <n-alert
            v-if="axfrResult.error"
            type="error"
            :bordered="false"
            show-icon
          >
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
