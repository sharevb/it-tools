<script setup lang="ts">
import { useScriptTag } from '@vueuse/core';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

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

const { load: loadIpLookup } = useScriptTag('/iplookup.js', undefined, { type: 'module', manual: true });

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
    ipv4.ip = (await (await fetch('https://api4.ipify.org?format=json', {
      mode: 'cors',
    })).json()).ip?.toString();
  }
  catch (e: any) {
    ipv4.error = `Not detected (${e.toString()})`;
  }
  try {
    ipv6.ip = (await (await fetch('https://api6.ipify.org?format=json', {
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
  <c-card title="Your IPv4/6 address details">
    <div v-if="clientIPDetails">
      <input-copyable v-model:value="clientIPDetails.ipv4" label-position="left" label-width="100px" label-align="right" readonly label="IPv4:" placeholder="Your IPv4" />
      <input-copyable v-model:value="clientIPDetails.ipv6" label-position="left" label-width="100px" label-align="right" readonly label="IPv6:" placeholder="Your IPv6" />
      <input-copyable v-model:value="clientIPDetails.location.country" label-position="left" label-width="100px" label-align="right" readonly label="Country:" />
      <input-copyable v-model:value="clientIPDetails.location.country_name" label-position="left" label-width="100px" label-align="right" readonly label="Country Name:" />
      <input-copyable v-model:value="clientIPDetails.location.continent" label-position="left" label-width="100px" label-align="right" readonly label="Continent Name:" />
    </div>
    <div flex justify-center gap-3>
      <c-button @click="refreshClientIP">
        Refresh
      </c-button>
    </div>
  </c-card>
</template>
