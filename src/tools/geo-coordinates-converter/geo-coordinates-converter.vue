<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import detectCSV from 'detect-csv';
import { flatten } from 'flatten-anything';
import { convertFrom } from './geo-coordinates-converter.service';
import { objectArrayToData } from '@/utils/objectarray.export';
import { useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const sourceSystem = useQueryParamOrStorage({ name: 'type', storageName: 'geo-coord-conv:t', defaultValue: 'BD09' });
const inputLatitude = useQueryParam({ tool: 'geo-coord-conv', name: 'lat', defaultValue: 39.915 });
const inputLongitude = useQueryParam({ tool: 'geo-coord-conv', name: 'lng', defaultValue: 116.404 });
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
      dms: `${toDMS(x)}, ${toDMS(y)}`,
    });
  }
  return output;
});

const columns = [
  { title: 'Coordinate System', key: 'system' },
  { title: 'Decimal Format (lng, lat)', key: 'decimal' },
  { title: 'DMS Format (lng, lat)', key: 'dms' },
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

function toDMS(deg: number) {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = (((deg - d) * 60 - m) * 60).toFixed(2);
  return `${d}°${m}′${s}″`;
}
</script>

<template>
  <div>
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
      <n-tab-pane name="single" tab="Single Lat/Lng Converter">
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
      <n-tab-pane name="batch" tab="Batch Lat/Lng Converter">
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
          Download {{ resultsData.length }} Results CSV
        </n-button>
      </n-space>
    </c-card>

    <n-alert type="info" :title="t('tools.geo-coordinates-converter.texts.title-notes')" mt-3>
      {{ t('tools.geo-coordinates-converter.texts.tag-longitude-east-is-positive-west-is-negative') }}<br>{{ t('tools.geo-coordinates-converter.texts.tag-latitude-north-is-positive-south-is-negative') }}
    </n-alert>
  </div>
</template>
