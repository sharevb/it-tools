<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const query = ref('');
const resolvedIp = ref('');
const loading = ref(false);
const results = ref<{ dnsbl: string; description: string; listed: boolean; response: string }[]>([]);
const showListedOnly = ref(false);

const dnsbls = [
  { dnsbl: 'zen.spamhaus.org', description: 'Combines Spamhaus SBL, XBL, and PBL for spam and exploits' },
  { dnsbl: 'bl.spamcop.net', description: 'SpamCop’s dynamic spam reporting list' },
  { dnsbl: 'b.barracudacentral.org', description: 'Barracuda’s reputation-based spam blacklist' },
  { dnsbl: 'dnsbl.sorbs.net', description: 'SORBS aggregate list for spam and relays' },
  { dnsbl: 'psbl.surriel.com', description: 'Passive spam block list based on reports' },
  { dnsbl: 'dnsbl.dronebl.org', description: 'Botnet and malware source blacklist' },
  { dnsbl: 'ubl.unsubscore.com', description: 'User-based spam and unsubscribe abuse list' },
  { dnsbl: 'cbl.abuseat.org', description: 'Open proxies and spam bots (used by Spamhaus)' },
  { dnsbl: 'dnsbl-1.uceprotect.net', description: 'UCEPROTECT Level 1: direct spam sources' },
  { dnsbl: 'dnsbl-2.uceprotect.net', description: 'UCEPROTECT Level 2: spammy networks' },
  { dnsbl: 'dnsbl-3.uceprotect.net', description: 'UCEPROTECT Level 3: entire ISP blocks' },
  { dnsbl: 'rbl.spamlab.com', description: 'Spamlab’s real-time spam blacklist' },
  { dnsbl: 'dnsbl.inps.de', description: 'German-based spam DNSBL' },
  { dnsbl: 'ix.dnsbl.manitu.net', description: 'Manitu’s spam and abuse blacklist' },
  { dnsbl: 'hostkarma.junkemailfilter.com', description: 'Multi-level DNSBL with whitelist and blacklist entries' },
  { dnsbl: 'rbl.realtimeblacklist.com', description: 'Real-time blacklist for spam and abuse' },
  { dnsbl: 'spamrbl.imp.ch', description: 'Swiss-based spam DNSBL' },
  { dnsbl: 'dnsbl.justspam.org', description: 'JustSpam’s spam and phishing list' },
  { dnsbl: 'db.wpbl.info', description: 'Weighted Private Blacklist for spam sources' },
  { dnsbl: 'dnsbl.kempt.net', description: 'Kempt’s spam DNSBL' },
  { dnsbl: 'rbl.efnetrbl.org', description: 'EFNet’s IRC abuse and spam blacklist' },
  { dnsbl: 'tor.dnsbl.sectoor.de', description: 'TOR exit node blacklist' },
  { dnsbl: 'short.rbl.jp', description: 'Japanese short URL spam blacklist' },
  { dnsbl: 'rbl.megarbl.net', description: 'MegaRBL for spam and malware sources' },
  { dnsbl: 'rbl.spamrats.com', description: 'RATS spam and dynamic IP blacklists' },
  { dnsbl: 'rbl.blocklist.de', description: 'Blocklist.de’s abuse-based blacklist' },
  { dnsbl: 'dnsbl.cyberlogic.net', description: 'Cyberlogic’s spam DNSBL' },
  { dnsbl: 'spam.dnsbl.sorbs.net', description: 'SORBS spam-specific list' },
  { dnsbl: 'smtp.dnsbl.sorbs.net', description: 'SORBS SMTP open relay list' },
  { dnsbl: 'web.dnsbl.sorbs.net', description: 'SORBS web server spam list' },
  { dnsbl: 'zombie.dnsbl.sorbs.net', description: 'SORBS zombie host list' },
  { dnsbl: 'http.dnsbl.sorbs.net', description: 'SORBS HTTP spam list' },
  { dnsbl: 'misc.dnsbl.sorbs.net', description: 'SORBS miscellaneous spam sources' },
  { dnsbl: 'dnsbl.spfbl.net', description: 'SPFBL’s spam and phishing blacklist' },
  { dnsbl: 'dnsbl.suomispam.net', description: 'Finnish spam DNSBL' },
  { dnsbl: 'dnsbl.nordspam.com', description: 'Nordspam’s spam blacklist' },
  { dnsbl: 'dnsbl.fabel.dk', description: 'Fabelsources spam DNSBL' },
  { dnsbl: 'dnsbl.abuse.ro', description: 'Romanian abuse DNSBL' },
  { dnsbl: 'dnsbl.antispam.or.id', description: 'Indonesian anti-spam blacklist' },
];

const columns = [
  { title: 'DNSBL', key: 'dnsbl' },
  { title: 'Description', key: 'description' },
  {
    title: 'Listed',
    key: 'listed',
    render(row: { listed: boolean }) {
      return row.listed ? '🚫 Listed' : '✅ Not Listed';
    },
  },
  { title: 'Response', key: 'response' },
];

const filteredResults = computed(() => {
  return showListedOnly.value
    ? results.value.filter(r => r.listed)
    : results.value;
});

function reverseIp(ip: string) {
  return ip.split('.').reverse().join('.');
}

type DnsAnswer = Array<{ type: number; data: string | null }>;

async function resolveDomainToIp(domain: string) {
  const url = `https://cloudflare-dns.com/dns-query?name=${domain}`;
  const headers = { Accept: 'application/dns-json' };

  try {
    const res = await fetch(url, { headers });
    const answer = (await res.json()).Answer as DnsAnswer;
    const ip = answer?.find(a => a.type === 1)?.data;
    return ip || null;
  }
  catch {
    return null;
  }
}

async function checkAllDnsbls() {
  if (!query.value) {
    return;
  }
  loading.value = true;
  results.value = [];

  let ip = query.value.trim();

  // Resolve domain to IP if needed
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
    const resolved = await resolveDomainToIp(ip);
    if (!resolved) {
      results.value = [{ dnsbl: 'Error', description: '', listed: false, response: 'Invalid domain or no A record found' }];
      loading.value = false;
      return;
    }
    ip = resolved;
  }

  resolvedIp.value = ip;

  const reversed = reverseIp(ip);
  const headers = { Accept: 'application/dns-json' };

  const checks = dnsbls.map(async (entry) => {
    const domain = `${reversed}.${entry.dnsbl}`;
    const url = `https://cloudflare-dns.com/dns-query?name=${domain}`;

    try {
      const res = await fetch(url, { headers });
      const answer = (await res.json()).Answer as DnsAnswer;

      // rejected DNS Query from SpamHaus
      if (answer && answer[0]?.data === '127.255.255.254') {
        answer[0].data = 'Rejected DNS Query by SpamHaus';
      }

      return {
        dnsbl: entry.dnsbl,
        description: entry.description,
        listed: !!answer,
        response: answer ? answer.map(a => a.data).join(', ') : 'No listing',
      };
    }
    catch (e: any) {
      return {
        dnsbl: entry.dnsbl,
        description: entry.description,
        listed: false,
        response: e.toString(),
      };
    }
  });

  results.value = await Promise.all(checks);
  loading.value = false;
}

function getRowClass(row: { listed: boolean }) {
  return row.listed ? 'listed-row' : 'clean-row';
}
</script>

<template>
  <NCard :title="t('tools.dnsbl-checker.texts.title-dnsbl-multi-checker')">
    <NInput v-model:value="query" :placeholder="t('tools.dnsbl-checker.texts.placeholder-enter-ip-or-domain')" clearable mb-2 />
    <NSpace justify="center">
      <NButton type="primary" :loading="loading" @click="checkAllDnsbls">
        {{ t('tools.dnsbl-checker.texts.tag-check-all') }}
      </NButton>
      <n-form-item :label="t('tools.dnsbl-checker.texts.label-show-listed-only')" label-placement="left">
        <NSwitch v-model:value="showListedOnly" />
      </n-form-item>
    </NSpace>

    <NDivider />

    <input-copyable :label="t('tools.dnsbl-checker.texts.label-resolved-ip')" label-position="left" :value="resolvedIp" mb-1 />
    <n-p>
      <span>{{ t('tools.dnsbl-checker.texts.tag-want-to-understand-why-an-ip-might-be-blacklisted-check-out') }}</span>
      <a href="https://letsextract.com/fr/dnsbl-checker/" target="_blank">{{ t('tools.dnsbl-checker.texts.tag-this-dnsbl-explanation-and-removal-guide') }}</a>{{ t('tools.dnsbl-checker.texts.tag-') }}
    </n-p>

    <NDivider />

    <NDataTable
      v-if="filteredResults.length"
      :columns="columns"
      :data="filteredResults"
      :pagination="false"
      :bordered="false"
      :row-class-name="getRowClass"
      style="margin-top: 12px;"
    />
  </NCard>
</template>

<style scoped>
.listed-row {
  background-color: #ffeaea; /* light red */
}
.clean-row {
  background-color: #eaffea; /* light green */
}
</style>
