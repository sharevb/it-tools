<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useScriptTag } from '@vueuse/core';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

const { t } = useI18n();

declare global {
  interface Window {
    IpLookup: (ip: string) => Promise<{
      country: string
      country_name: string
      country_native: string
      continent: string
      continent_name: string

    }>
  }
}

const base = import.meta.env.BASE_URL ?? '/';

const { load: loadIpLookup } = useScriptTag(`${base}iplookup.js`, undefined, { type: 'module', manual: true });

const [clientIPDetails, refreshClientIP] = computedRefreshableAsync(async () => {
  const ipv4 = { ip: '', error: '' };
  const ipv6 = { ip: '', error: '' };
  const location = {
    country: {
      country: '',
      country_name: '',
      country_native: '',
      continent: '',
      continent_name: '',
    },
    error: '',
  };
  try {
    ipv4.ip = (await (await fetch('//api4.ipify.org?format=json', {
      mode: 'cors',
    })).json()).ip?.toString();
  }
  catch (e: any) {
    ipv4.error = `Not detected (${e.toString()})`;
  }
  try {
    ipv6.ip = (await (await fetch('//api6.ipify.org?format=json', {
      mode: 'cors',
    })).json()).ip?.toString();
  }
  catch (e: any) {
    ipv6.error = `Not detected (${e.toString()})`;
  }

  await loadIpLookup();
  try {
    location.country = await window.IpLookup(ipv6.ip || ipv4.ip);
  }
  catch (e: any) {
    location.error = e.toString();
  }

  return {
    ipv4: ipv4.ip || ipv4.error,
    ipv6: ipv6.ip || ipv6.error,
    location: {
      country: location.country?.country || `ERROR: ${location.error || 'Unknown'}`,
      country_name: location.country ? `${location.country?.country_name}/${location.country?.country_native}` : '',
      continent: location.country ? location.country?.continent : '',
    },
  };
});
</script>

<template>
  <c-card :title="t('tools.my-ip.texts.title-your-ipv4-6-address-details')">
    <div v-if="clientIPDetails">
      <input-copyable v-model:value="clientIPDetails.ipv4" label-position="left" label-width="100px" label-align="right" readonly :label="t('tools.my-ip.texts.label-ipv4')" :placeholder="t('tools.my-ip.texts.placeholder-your-ipv4')" />
      <input-copyable v-model:value="clientIPDetails.ipv6" label-position="left" label-width="100px" label-align="right" readonly :label="t('tools.my-ip.texts.label-ipv6')" :placeholder="t('tools.my-ip.texts.placeholder-your-ipv6')" />
      <input-copyable v-model:value="clientIPDetails.location.country" label-position="left" label-width="100px" label-align="right" readonly :label="t('tools.my-ip.texts.label-country')" />
      <input-copyable v-model:value="clientIPDetails.location.country_name" label-position="left" label-width="100px" label-align="right" readonly :label="t('tools.my-ip.texts.label-country-name')" />
      <input-copyable v-model:value="clientIPDetails.location.continent" label-position="left" label-width="100px" label-align="right" readonly :label="t('tools.my-ip.texts.label-continent-name')" />
    </div>
    <div flex justify-center gap-3>
      <c-button @click="refreshClientIP">
        {{ t('tools.my-ip.texts.tag-refresh') }}
      </c-button>
    </div>
  </c-card>
</template>
