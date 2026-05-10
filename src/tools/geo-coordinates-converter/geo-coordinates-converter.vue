<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import detectCSV from 'detect-csv';
import { flatten } from 'flatten-anything';
import { convertFrom } from './geo-coordinates-converter.service';
import { objectArrayToData } from '@/utils/objectarray.export';
import { useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';
import proj4 from 'proj4';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { t } = useI18n();

const decimal = reactive({
  lat: 48.8566,
  lng: 2.3522,
  latDir: 'N',
  lngDir: 'E',
});

const sourceSystem = useQueryParamOrStorage({ name: 'type', storageName: 'geo-coord-conv:t', defaultValue: 'BD09' });
const inputLatitude = useQueryParam({ tool: 'geo-coord-conv', name: 'lat', defaultValue: 48.8566 });
watch(inputLatitude, v => decimal.lat = v);
const inputLongitude = useQueryParam({ tool: 'geo-coord-conv', name: 'lng', defaultValue: 2.3522 });
watch(inputLongitude, v => decimal.lng = v);
const inputCSV = ref('');
const batchRows = ref<string[][]>([]);
const resultsData = ref<Record<string, { lat: number; lng: number }>[]>([]);
const resultsDisplay = computed(() => {
  if (resultsData.value.length !== 1) {
    return [];
  }

  const output: { system: string; decimal: string; dms: string }[] = [];
  for (const [system, { lat: x, lng: y }] of Object.entries(resultsData.value[0])) {
    output.push({
      system,
      decimal: `${x.toFixed(6)}, ${y.toFixed(6)}`,
      dms: `${toDMSString(x)}, ${toDMSString(y)}`,
    });
  }
  return output;
});

const columns = [
  { title: t('tools.geo-coordinates-converter.text.coordinate-system'), key: 'system' },
  { title: t('tools.geo-coordinates-converter.text.decimal-format-lng-lat'), key: 'decimal' },
  { title: t('tools.geo-coordinates-converter.text.dms-format-lng-lat'), key: 'dms' },
];

function convertSingle() {
  const converted = convertFrom(sourceSystem.value, inputLongitude.value, inputLatitude.value);
  resultsData.value = [converted];
}

function convertBatch() {
  const delimiter = detectCSV(inputCSV.value)?.delimiter || ',';
  batchRows.value = inputCSV.value.trim().split('\n').map(l => l.trim().split(delimiter).map(s => s.trim()));

  if (batchRows.value.length === 0) {
    return;
  }

  const output = [];

  for (const row of batchRows.value) {
    const [lng, lat] = row.map(Number);
    if (Number.isNaN(Number(lng)) || Number.isNaN(Number(lat))) {
      continue;
    }

    const converted = convertFrom(sourceSystem.value, lng, lat);

    output.push(converted);
  }

  resultsData.value = output;
}

function downloadCsv() {
  const csv = objectArrayToData(resultsData.value.map(r => flatten(r)), 'csv');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'converted_coordinates.csv';
  a.click();

  URL.revokeObjectURL(url);
}

function toDMSString(deg: number) {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = (((deg - d) * 60 - m) * 60).toFixed(2);
  return `${d}°${m}′${s}″`;
}

// -----------------------------
// CONSTANTS
// -----------------------------
const latDirOptions = [
  { label: 'N', value: 'N' },
  { label: 'S', value: 'S' },
];

const lngDirOptions = [
  { label: 'E', value: 'E' },
  { label: 'W', value: 'W' },
];

const hemisphereOptions = [
  { label: t('tools.geo-coordinates-converter.texts.north'), value: 'N' },
  { label: t('tools.geo-coordinates-converter.texts.south'), value: 'S' },
];

const degree = reactive({
  lat: { d: 48, m: 51, s: 23.76 },
  lng: { d: 2, m: 21, s: 7.92 },
  latDir: 'N',
  lngDir: 'E',
});

const utm = reactive({
  zone: 31,
  hemisphere: 'N',
  easting: 448251,
  northing: 5411932,
});

const mapRef = ref<HTMLElement | null>(null);
watch(mapRef, () => initMap());
let map: L.Map;
let marker: L.Marker;

// -----------------------------
// HELPERS
// -----------------------------
function applyDir(value: number, dir: string) {
  return dir === 'S' || dir === 'W' ? -Math.abs(value) : Math.abs(value);
}

function dmsToDecimal(d: number, m: number, s: number, dir: string) {
  const val = d + m / 60 + s / 3600;
  return applyDir(val, dir);
}

function decimalToDms(value: number) {
  const abs = Math.abs(value);
  const d = Math.floor(abs);
  const minFloat = (abs - d) * 60;
  const m = Math.floor(minFloat);
  const s = (minFloat - m) * 60;
  return { d, m, s };
}

function getUtmProjection(zone: number, hemisphere: string) {
  return `+proj=utm +zone=${zone} ${hemisphere === 'S' ? '+south' : ''} +datum=WGS84 +units=m +no_defs`;
}

// -----------------------------
// UPDATE HANDLERS
// -----------------------------
function onDecimalChange() {
  const lat = applyDir(decimal.lat, decimal.latDir);
  const lng = applyDir(decimal.lng, decimal.lngDir);

  inputLatitude.value = lat;
  inputLongitude.value = lng;

  // Update DMS
  const dLat = decimalToDms(lat);
  const dLng = decimalToDms(lng);
  degree.lat = dLat;
  degree.lng = dLng;
  degree.latDir = lat >= 0 ? 'N' : 'S';
  degree.lngDir = lng >= 0 ? 'E' : 'W';

  // Update UTM
  const zone = Math.floor((lng + 180) / 6) + 1;
  const proj = getUtmProjection(zone, lat >= 0 ? 'N' : 'S');
  const [easting, northing] = proj4('EPSG:4326', proj, [lng, lat]);

  utm.zone = zone;
  utm.hemisphere = lat >= 0 ? 'N' : 'S';
  utm.easting = Math.round(easting);
  utm.northing = Math.round(northing);

  updateMarker();
}

function onDegreeChange() {
  decimal.lat = dmsToDecimal(degree.lat.d, degree.lat.m, degree.lat.s, degree.latDir);
  decimal.lng = dmsToDecimal(degree.lng.d, degree.lng.m, degree.lng.s, degree.lngDir);
  decimal.latDir = degree.latDir;
  decimal.lngDir = degree.lngDir;
  onDecimalChange();
}

function onUtmChange() {
  const proj = getUtmProjection(utm.zone, utm.hemisphere);
  const [lng, lat] = proj4(proj, 'EPSG:4326', [utm.easting, utm.northing]);

  decimal.lat = Number.parseFloat(lat.toFixed(6));
  decimal.lng = Number.parseFloat(lng.toFixed(6));
  decimal.latDir = lat >= 0 ? 'N' : 'S';
  decimal.lngDir = lng >= 0 ? 'E' : 'W';

  onDecimalChange();
}

function initMap() {
  try {
    if (!mapRef.value) {
      return;
    }
    map = L.map(mapRef.value).setView([decimal.lat, decimal.lng], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      referrerPolicy: 'strict-origin-when-cross-origin',
    }).addTo(map);

    marker = L.marker([decimal.lat, decimal.lng], { draggable: true }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      decimal.lat = Number.parseFloat(pos.lat.toFixed(6));
      decimal.lng = Number.parseFloat(pos.lng.toFixed(6));
      decimal.latDir = pos.lat >= 0 ? 'N' : 'S';
      decimal.lngDir = pos.lng >= 0 ? 'E' : 'W';
      onDecimalChange();
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      decimal.lat = Number.parseFloat(e.latlng.lat.toFixed(6));
      decimal.lng = Number.parseFloat(e.latlng.lng.toFixed(6));
      decimal.latDir = e.latlng.lat >= 0 ? 'N' : 'S';
      decimal.lngDir = e.latlng.lng >= 0 ? 'E' : 'W';
      onDecimalChange();
    });
  }
  catch {}
}

onMounted(() => {
  initMap();
});

function updateMarker() {
  marker.setLatLng([decimal.lat, decimal.lng]);
  map.setView([decimal.lat, decimal.lng]);
}
</script>

<template>
  <div>
    <n-tabs type="card" mb-1>
      <n-tab-pane name="coords" :tab="t('tools.geo-coordinates-converter.texts.coordinates-notations')">
        <n-card :title="t('tools.geo-coordinates-converter.texts.decimal-notation')" mb-2>
          <n-form :model="decimal" label-placement="left" label-width="140">
            <n-form-item :label="t('tools.geo-coordinates-converter.texts.latitude-decimal')">
              <n-input-group gap-1>
                <n-input-number v-model:value="decimal.lat" :precision="6" @update:value="onDecimalChange" />
                <n-select v-model:value="decimal.latDir" :options="latDirOptions" style="width: 80px" @update:value="onDecimalChange" />
              </n-input-group>
            </n-form-item>

            <n-form-item :label="t('tools.geo-coordinates-converter.texts.longitude-decimal')">
              <n-input-group gap-1>
                <n-input-number v-model:value="decimal.lng" :precision="6" @update:value="onDecimalChange" />
                <n-select v-model:value="decimal.lngDir" :options="lngDirOptions" style="width: 80px" @update:value="onDecimalChange" />
              </n-input-group>
            </n-form-item>
          </n-form>
        </n-card>

        <n-card :title="t('tools.geo-coordinates-converter.texts.dms-notation')" mb-2>
          <n-form :model="degree" label-placement="left" label-width="140">
            <n-form-item :label="t('tools.geo-coordinates-converter.texts.latitude-dms')">
              <n-input-group gap-1>
                <n-input-number v-model:value="degree.lat.d" placeholder="°" @update:value="onDegreeChange" />
                <n-input-number v-model:value="degree.lat.m" placeholder="′" @update:value="onDegreeChange" />
                <n-input-number v-model:value="degree.lat.s" placeholder="″" @update:value="onDegreeChange" />
                <n-select v-model:value="degree.latDir" :options="latDirOptions" style="width: 80px" @update:value="onDegreeChange" />
              </n-input-group>
            </n-form-item>

            <n-form-item :label="t('tools.geo-coordinates-converter.texts.longitude-dms')">
              <n-input-group gap-1>
                <n-input-number v-model:value="degree.lng.d" placeholder="°" @update:value="onDegreeChange" />
                <n-input-number v-model:value="degree.lng.m" placeholder="′" @update:value="onDegreeChange" />
                <n-input-number v-model:value="degree.lng.s" placeholder="″" @update:value="onDegreeChange" />
                <n-select v-model:value="degree.lngDir" :options="lngDirOptions" style="width: 80px" @update:value="onDegreeChange" />
              </n-input-group>
            </n-form-item>
          </n-form>
        </n-card>

        <n-card :title="t('tools.geo-coordinates-converter.texts.utm-notation')" mb-2>
          <n-form :model="utm" label-placement="left" label-width="140">
            <n-form-item :label="t('tools.geo-coordinates-converter.texts.utm-zone')">
              <n-input-number v-model:value="utm.zone" @update:value="onUtmChange" />
            </n-form-item>

            <n-form-item :label="t('tools.geo-coordinates-converter.texts.hemisphere')">
              <n-select v-model:value="utm.hemisphere" :options="hemisphereOptions" @update:value="onUtmChange" />
            </n-form-item>

            <n-form-item :label="t('tools.geo-coordinates-converter.texts.easting')">
              <n-input-number v-model:value="utm.easting" @update:value="onUtmChange" />
            </n-form-item>

            <n-form-item :label="t('tools.geo-coordinates-converter.texts.northing')">
              <n-input-number v-model:value="utm.northing" @update:value="onUtmChange" />
            </n-form-item>
          </n-form>
        </n-card>

        <div ref="mapRef" style="height: 400px; width: 100%; border-radius: 8px; overflow: hidden" />
      </n-tab-pane>
      <n-tab-pane name="proj" :tab="t('tools.geo-coordinates-converter.texts.decimal-projections')">
        <n-radio-group v-model:value="sourceSystem" mb-2>
          <n-space justify="center">
            <n-radio value="WGS84">
              {{ t('tools.geo-coordinates-converter.texts.tag-wgs84-wsg1984-epsg4326-global-standard') }}
            </n-radio>
            <n-radio value="GCJ02">
              {{ t('tools.geo-coordinates-converter.texts.tag-gcj02-amap-gaode-qq-maps') }}
            </n-radio>
            <n-radio value="BD09">
              {{ t('tools.geo-coordinates-converter.texts.tag-bd09-bd09ll-bmap-baidu-maps') }}
            </n-radio>
            <n-radio value="BD09MC">
              {{ t('tools.geo-coordinates-converter.texts.tag-bd09mc-bd09meter-baidu-meter') }}
            </n-radio>
            <n-radio value="CGCS2000">
              {{ t('tools.geo-coordinates-converter.texts.tag-cgcs2000-china-geodetic-system-2000') }}
            </n-radio>
            <n-radio value="WebMercator">
              {{ t('tools.geo-coordinates-converter.texts.tag-webmercator-epsg3857-epsg900913') }}
            </n-radio>
          </n-space>
        </n-radio-group>

        <n-tabs type="card" mb-1>
          <n-tab-pane name="single" :tab="t('tools.geo-coordinates-converter.text.single-lat-lng-converter')">
            <n-space justify="center">
              <n-form-item :label="t('tools.geo-coordinates-converter.texts.label-latitude')" label-placement="left">
                <n-input-number-i18n v-model:value="inputLatitude" />
              </n-form-item>
              <n-form-item :label="t('tools.geo-coordinates-converter.texts.label-longitude')" label-placement="left">
                <n-input-number-i18n v-model:value="inputLongitude" />
              </n-form-item>
            </n-space>
            <n-space justify="center">
              <n-button type="primary" @click="convertSingle">
                {{ t('tools.geo-coordinates-converter.texts.tag-convert-single') }}
              </n-button>
            </n-space>
          </n-tab-pane>
          <n-tab-pane name="batch" :tab="t('tools.geo-coordinates-converter.text.batch-lat-lng-converter')">
            <c-input-text
              v-model:value="inputCSV"
              :label="t('tools.geo-coordinates-converter.texts.label-csv-content-lng-lat')"
              :placeholder="t('tools.geo-coordinates-converter.texts.placeholder-put-your-longitude-and-latitude-in-this-order-csv-to-convert')"
              multiline
              rows="5"
              mb-2
            />

            <n-space justify="center">
              <n-button
                type="primary"
                @click="convertBatch"
              >
                {{ t('tools.geo-coordinates-converter.texts.tag-convert-batch') }}
              </n-button>
            </n-space>
          </n-tab-pane>
        </n-tabs>

        <c-card v-if="resultsData?.length" :title="t('tools.geo-coordinates-converter.texts.title-conversion-results')" mb-2>
          <n-data-table v-if="resultsDisplay?.length" :columns="columns" :data="resultsDisplay" bordered mb-2 />

          <n-space justify="center">
            <n-button
              type="success"
              :disabled="resultsData.length === 0"
              @click="downloadCsv"
            >
              {{ $t('tools.geo-coordinates-converter.text.download-results-csv') }}
            </n-button>
          </n-space>
        </c-card>

        <n-alert type="info" :title="t('tools.geo-coordinates-converter.texts.title-notes')" mt-3>
          {{ t('tools.geo-coordinates-converter.texts.tag-longitude-east-is-positive-west-is-negative') }}<br>{{ t('tools.geo-coordinates-converter.texts.tag-latitude-north-is-positive-south-is-negative') }}
        </n-alert>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
