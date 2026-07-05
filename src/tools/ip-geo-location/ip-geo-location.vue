<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';
import { useITStorage, useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const ip = useQueryParam({ tool: 'ip-geo-loc', name: 'ip', defaultValue: '8.8.8.8' });
const errorMessage = ref('');

const fields: Array<{ field: string; name: string }> = [
  { field: 'ip', name: 'IP' },
  { field: 'hostname', name: 'Host Name' },
  { field: 'country', name: 'Country Code' },
  { field: 'region', name: 'Region/state Code' },
  { field: 'city', name: 'City' },
  { field: 'postal', name: 'Postal Code' },
  { field: 'loc', name: 'Latitude/Longitude' },
  { field: 'timezone', name: 'Timezone' },
  { field: 'org', name: 'Organization Name' },
];

const geoInfos = ref<CKeyValueListItems>([]);
const geoInfosData = ref<{
  loc?: string
}>({});
const status = ref<'pending' | 'error' | 'success'>('pending');
const token = useITStorage('ip-geoloc:token', '');

const openStreetMapUrl = computed(
  () => {
    const [gpsLatitude, gpsLongitude] = geoInfosData.value.loc?.split(',') || [];
    return gpsLatitude && gpsLongitude ? `https://www.openstreetmap.org/?mlat=${gpsLatitude}&mlon=${gpsLongitude}#map=18/${gpsLatitude}/${gpsLongitude}` : undefined;
  },
);

async function onGetInfos() {
  try {
    status.value = 'pending';

    const geoInfoQueryResponse = await fetch(
      token.value !== ''
        ? `//ipinfo.io/${ip.value}/json?token=${token.value}`
        : `//ipinfo.io/${ip.value}/json`);
    if (!geoInfoQueryResponse.ok) {
      throw geoInfoQueryResponse.statusText;
    }

    const data = await geoInfoQueryResponse.json();

    const allGeoInfos = [];
    for (const field of fields) {
      if (data[field.field]) {
        allGeoInfos.push({
          label: field.name,
          value: data[field.field],
        });
      }
    }

    status.value = 'success';
    geoInfos.value = allGeoInfos;
    geoInfosData.value = data;
  }
  catch (e: any) {
    errorMessage.value = e.toString();
    status.value = 'error';
    return [];
  }
}
</script>

<template>
  <div>
    <div flex items-center gap-2>
      <c-input-text
        v-model:value="ip"
        :placeholder="t('tools.ip-geo-location.texts.placeholder-enter-an-ipv4-6')"
        @update:value="() => { status = 'pending' }"
      />
      <c-button align-center @click="onGetInfos">
        {{ t('tools.ip-geo-location.texts.tag-get-geo-location-infos') }}
      </c-button>
    </div>

    <details mt-2>
      <summary>{{ t('tools.ip-geo-location.texts.tag-optional-ipinfo-io-token') }}</summary>
      <c-input-text
        v-model:value="token"
        :placeholder="t('tools.ip-geo-location.texts.placeholder-optional-ipinfo-io-token')"
        @update:value="() => { status = 'pending' }"
      />
      <n-p>
        <n-a href="https://ipinfo.io/">
          {{ t('tools.ip-geo-location.texts.tag-signup-for-a-free-token') }}
        </n-a>
      </n-p>
    </details>

    <n-divider />

    <c-card v-if="status === 'pending'" mt-5>
      {{ t('tools.ip-geo-location.texts.tag-click-on-button-above-to-get-latest-infos') }}
    </c-card>

    <c-card v-if="status === 'success' && openStreetMapUrl" mt-4>
      <c-button :href="openStreetMapUrl" target="_blank">
        {{ t('tools.ip-geo-location.texts.tag-localize-on-open-street-map') }}
      </c-button>
    </c-card>

    <c-card v-if="status === 'success'" mt-5>
      <c-key-value-list :items="geoInfos" />
    </c-card>

    <n-alert v-if="status === 'error'" :title="t('tools.ip-geo-location.texts.title-errors-occured')" type="error" mt-5>
      {{ errorMessage }}
    </n-alert>
  </div>
</template>
