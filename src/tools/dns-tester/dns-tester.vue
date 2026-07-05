<script setup lang="ts">
import { useNetworkUtilsConfig } from '@/tools/network-utils/network-utils-config';
import { Base64 } from 'js-base64';

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

const resolverIP = ref('');

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
    resolver_ip: resolverIP.value,
  });
}

async function runWhois() {
  whoisResult.value = await api('/whois', { domain: whoisDomain.value });
}

async function runDnssec() {
  dnssecResult.value = await api('/dnssec', {
    domain: dnssecDomain.value,
    resolver_ip: resolverIP.value,
  });
}

async function runReverse() {
  reverseResult.value = await api('/reverse-dns', {
    ip: reverseIp.value,
    resolver_ip: resolverIP.value,
  });
}

async function runAxfr() {
  axfrResult.value = await api('/soa-axfr', {
    domain: axfrDomain.value,
    resolver_ip: resolverIP.value,
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
      <NInput v-model:value="resolverIP" placeholder="8.8.8.8 or leave empty for default /etc/resolv.conf DNS configuration" />
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
          <n-button :loading="loading" @click="runDns">
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

          <textarea-copyable
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
          <n-button type="primary" :loading="loading" @click="runDnssec">
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
          <n-button type="primary" :loading="loading" @click="runReverse">
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
          <n-button type="primary" :loading="loading" @click="runAxfr">
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
