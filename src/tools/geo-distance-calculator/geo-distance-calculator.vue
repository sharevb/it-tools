<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import haversine from 'haversine';
import SpanCopyable from '@/components/SpanCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const latitude1 = useQueryParamOrStorage({ name: 'lat1', storageName: 'geo-dist:lat1', defaultValue: 0 });
const longitude1 = useQueryParamOrStorage({ name: 'lng1', storageName: 'geo-dist:lng1', defaultValue: 0 });

const latitude2 = useQueryParamOrStorage({ name: 'lat2', storageName: 'geo-dist:lat2', defaultValue: 0 });
const longitude2 = useQueryParamOrStorage({ name: 'lng2', storageName: 'geo-dist:lng2', defaultValue: 0 });

const start = computed(() => ({ latitude: latitude1.value, longitude: longitude1.value }));
const end = computed(() => ({ latitude: latitude2.value, longitude: longitude2.value }));

const { coords: userCoords } = useGeolocation();

const distanceKM = computed(() => haversine(start.value, end.value, { unit: 'km' }));
const distanceMeter = computed(() => haversine(start.value, end.value, { unit: 'meter' }));
const distanceMile = computed(() => haversine(start.value, end.value, { unit: 'mile' }));
const distanceNMI = computed(() => haversine(start.value, end.value, { unit: 'nmi' }));
</script>

<template>
  <div>
    <c-card :title="t('tools.geo-distance-calculator.texts.title-distance-computer')" mb-2>
      <n-form-item :label="t('tools.geo-distance-calculator.texts.label-geolocation-1-latitude-longitude')">
        <n-space justify="space-between">
          <n-input-number-i18n v-model:value="latitude1" :min="-90" :max="90" :placeholder="t('tools.geo-distance-calculator.texts.placeholder-latitude')" />
          <n-input-number-i18n v-model:value="longitude1" :min="-180" :max="180" :placeholder="t('tools.geo-distance-calculator.texts.placeholder-longitude')" />
        </n-space>
      </n-form-item>
      <n-form-item :label="t('tools.geo-distance-calculator.texts.label-geolocation-2-latitude-longitude')" gap-2>
        <n-space justify="space-between">
          <n-input-number-i18n v-model:value="latitude2" :min="-90" :max="90" :placeholder="t('tools.geo-distance-calculator.texts.placeholder-latitude')" />
          <n-input-number-i18n v-model:value="longitude2" :min="-180" :max="180" :placeholder="t('tools.geo-distance-calculator.texts.placeholder-longitude')" />
        </n-space>
      </n-form-item>

      <n-divider />

      <n-form-item :label="t('tools.geo-distance-calculator.texts.label-distance-km')" label-width="120px" label-placement="left">
        <SpanCopyable :value="distanceKM.toString()" />
      </n-form-item>
      <n-form-item :label="t('tools.geo-distance-calculator.texts.label-distance-mile')" label-width="120px" label-placement="left">
        <SpanCopyable :value="distanceMile.toString()" />
      </n-form-item>
      <n-form-item :label="t('tools.geo-distance-calculator.texts.label-distance-meter')" label-width="120px" label-placement="left">
        <SpanCopyable :value="distanceMeter.toString()" />
      </n-form-item>
      <n-form-item :label="t('tools.geo-distance-calculator.texts.label-distance-nmi')" label-width="120px" label-placement="left">
        <SpanCopyable :value="distanceNMI.toString()" />
      </n-form-item>
    </c-card>

    <c-card :title="t('tools.geo-distance-calculator.texts.title-your-position')">
      <n-space justify="center">
        <n-form-item :label="t('tools.geo-distance-calculator.texts.label-latitude')" label-placement="left">
          <SpanCopyable :value="userCoords?.latitude?.toString() || 'Unknown'" />
        </n-form-item>
        <n-form-item :label="t('tools.geo-distance-calculator.texts.label-longitude')" label-placement="left">
          <SpanCopyable :value="userCoords?.longitude?.toString() || 'Unknown'" />
        </n-form-item>
      </n-space>
      <n-space justify="center">
        <n-form-item :label="t('tools.geo-distance-calculator.texts.label-altitude')" label-placement="left">
          <SpanCopyable :value="userCoords?.altitude?.toString() || 'Unknown'" />
        </n-form-item>
        <n-form-item :label="t('tools.geo-distance-calculator.texts.label-heading')" label-placement="left">
          <SpanCopyable :value="userCoords?.heading?.toString() || 'Unknown'" />
        </n-form-item>
        <n-form-item :label="t('tools.geo-distance-calculator.texts.label-speed')" label-placement="left">
          <SpanCopyable :value="userCoords?.speed?.toString() || 'Unknown'" />
        </n-form-item>
        <n-form-item :label="t('tools.geo-distance-calculator.texts.label-accuracy')" label-placement="left">
          <SpanCopyable :value="userCoords?.accuracy?.toString() || 'Unknown'" />
        </n-form-item>
      </n-space>
    </c-card>
  </div>
</template>
