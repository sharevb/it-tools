<script setup lang="ts">
import { Buffer } from 'node:buffer';
import { useI18n } from 'vue-i18n';
import type { Ref } from 'vue';
import potrace from 'potrace';
import { Base64 } from 'js-base64';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { potrace as colorPotrace, init as colorPotraceInit } from 'esm-potrace-wasm';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { convertToSVG } from './colorVTracer';
import { appBaseUrl as base } from '@/utils/base-url';

const { t } = useI18n();

async function traceAsync(input: Buffer) {
  return new Promise<string>((resolve, reject) => {
    potrace.trace(input, (err: Error | null, svg: string) => {
      if (err) {
        reject(err);
      }
      resolve(svg);
    });
  });
}

async function posterizeAsync(input: Buffer) {
  return new Promise<string>((resolve, reject) => {
    potrace.posterize(input,
      (err: Error | null, svg: string) => {
        if (err) {
          reject(err);
        }
        resolve(svg);
      });
  });
}

function file2Buffer(file: File) {
  return new Promise<Buffer>((resolve, _reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const buffer = Buffer.from(reader.result as ArrayBuffer);
      resolve(buffer);
    });
    reader.readAsArrayBuffer(file);
  });
}

// import vtracer as JS module populating window.vtracerInit and ColorImageConverter
const { load: loadVTracer } = useScriptTag(`${base}vtracer/vtracer_webapp.js`, undefined, { type: 'module', manual: true });
await loadVTracer();

const file2Blob = async (file: File) => new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type });

const processing = ref(false);

const colorspace = useQueryParamOrStorage<'bw' | 'gray' | 'color' | 'vtracer'>({ name: 'mode', storageName: 'potrace:m', defaultValue: 'bw' });

const hierarchical = useQueryParamOrStorage<'stacked' | 'cutout'>({ name: 'hierarchical', storageName: 'potrace:h', defaultValue: 'stacked' });
const filter_speckle = useQueryParamOrStorage<number>({ name: 'filter_speckle', storageName: 'potrace:fs', defaultValue: 4 });
const corner_threshold = useQueryParamOrStorage<number>({ name: 'corner_threshold', storageName: 'potrace:ct', defaultValue: 60 });
const color_precision = useQueryParamOrStorage<number>({ name: 'color_precision', storageName: 'potrace:cp', defaultValue: 6 });
const length_threshold = useQueryParamOrStorage<number>({ name: 'length_threshold', storageName: 'potrace:lt', defaultValue: 4 });
const splice_threshold = useQueryParamOrStorage<number>({ name: 'splice_threshold', storageName: 'potrace:st', defaultValue: 45 });
const layer_difference = useQueryParamOrStorage<number>({ name: 'layer_difference', storageName: 'potrace:ld', defaultValue: 16 });
const fitting = useQueryParamOrStorage<'pixel' | 'polygon' | 'spline'>({ name: 'fit', storageName: 'potrace:f', defaultValue: 'spline' });

const interpolate = ref(false);
const fileInput = ref() as Ref<File>;
const svg = ref<string>('');

function deg2rad(deg: number) {
  return deg / 180 * 3.141592654;
}
async function computeSVG() {
  const file = fileInput.value;
  if (!file) {
    return '';
  }

  const colorspaceValue = colorspace.value;
  const interpolateValue = interpolate.value;

  processing.value = true;
  try {
    switch (colorspaceValue) {
      case 'bw':
        svg.value = await traceAsync(await file2Buffer(file));
        break;
      case 'gray':
        svg.value = await posterizeAsync(await file2Buffer(file));
        break;
      case 'color':
        await colorPotraceInit();

        svg.value = await colorPotrace(await file2Blob(file), {
          turdsize: 2,
          turnpolicy: 4, // minority
          alphamax: 1,
          opticurve: 1,
          opttolerance: 0.2,
          pathonly: false,
          extractcolors: true,
          posterizelevel: 2,
          posterizationalgorithm: interpolateValue ? 1 : 0,
        });
        break;
      case 'vtracer':
        svg.value = await convertToSVG(file, {
          color: true,
          color_precision: 8 - color_precision.value,
          corner_threshold: deg2rad(corner_threshold.value),
          filter_speckle: filter_speckle.value * filter_speckle.value,
          hierarchical: hierarchical.value,
          length_threshold: length_threshold.value,
          splice_threshold: deg2rad(splice_threshold.value),
          mode: fitting.value,
          wasmPath: `${base}vtracer/vtracer_webapp_bg.wasm`,
          clustering_mode: 'color',
          layer_difference: layer_difference.value,
          path_precision: 8,
        },
        );
        break;
    }
  }
  catch (e: any) {
    svg.value = e.toString();
  }
  finally {
    processing.value = false;
  }
};

const svgBase64 = computed(() => svg.value ? `data:image/svg+xml;base64,${Base64.encode(svg.value)}` : '');

async function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}
</script>

<template>
  <div>
    <c-file-upload
      :title="t('tools.potrace.texts.title-drag-and-drop-an-image-here-or-click-to-select-a-file')"
      :paste-image="true"
      @file-upload="onUpload"
    />

    <n-space justify="center" mb-2>
      <n-radio-group v-model:value="colorspace" mt-2>
        <n-radio value="bw">
          {{ $t('tools.potrace.texts.bw') }}
        </n-radio>
        <n-radio value="gray">
          {{ $t('tools.color-converter.texts.label-grayscale') }}
        </n-radio>
        <n-radio value="color">
          {{ $t('tools.potrace.texts.color-potrace') }}
        </n-radio>
        <n-radio value="vtracer">
          {{ $t('tools.potrace.texts.color-vtracer') }}
        </n-radio>
      </n-radio-group>
    </n-space>

    <div v-if="colorspace === 'color'" mb-2>
      <n-space justify="center" mt-2>
        <n-form-item label-placement="left">
          <n-checkbox v-model:checked="interpolate">
            {{ $t('tools.potrace.texts.interpolate') }}
          </n-checkbox>
        </n-form-item>
      </n-space>
    </div>

    <div v-if="colorspace === 'vtracer'" mb-2>
      <n-space justify="center" wrap mt-2>
        <n-form-item :label="$t('tools.potrace.texts.curve-fitting')" label-placement="left">
          <n-select
            v-model:value="fitting"
            :options="[
              { label: t('tools.potrace.texts.pixel'), value: 'pixel' },
              { label: t('tools.potrace.texts.polygon'), value: 'polygon' },
              { label: t('tools.potrace.texts.spline'), value: 'spline' },
            ]"
          />
        </n-form-item>

        <n-form-item :label="$t('tools.potrace.texts.hierarchical-mode')" label-placement="left">
          <n-select
            v-model:value="hierarchical"
            :options="[
              { label: t('tools.potrace.texts.stacked'), value: 'stacked' },
              { label: t('tools.potrace.texts.cutout'), value: 'cutout' },
            ]"
          />
        </n-form-item>

        <n-form-item :label="$t('tools.potrace.texts.filter-speckle-cleaner')" label-placement="left" :title="$t('tools.potrace.texts.discard-patches-small-than-x-px-in-size')">
          <n-input-number v-model:value="filter_speckle" min="0" max="128" />
        </n-form-item>
        <n-form-item :label="$t('tools.potrace.texts.gradient-step-less-layers')" label-placement="left" :title="$t('tools.potrace.texts.color-difference-between-gradient-layers')">
          <n-input-number v-model:value="layer_difference" min="0" max="255" />
        </n-form-item>
        <n-form-item :label="$t('tools.potrace.texts.color-precision-more-accurate')" label-placement="left" :title="$t('tools.potrace.texts.number-of-significant-bits-to-use-in-a-rgb-channel')">
          <n-input-number v-model:value="color_precision" min="1" max="8" />
        </n-form-item>
        <n-form-item v-if="fitting === 'spline'" :label="$t('tools.potrace.texts.corner-threshold-smoother')" label-placement="left" :title="$t('tools.potrace.texts.minimum-momentary-angle-in-degrees-to-be-considered-a-corner-to-be-kept-after-smoothing')">
          <n-input-number v-model:value="corner_threshold" min="0" max="180" />
        </n-form-item>
        <n-form-item v-if="fitting === 'spline'" :label="$t('tools.potrace.texts.length-threshold-more-coarse')" label-placement="left" :title="$t('tools.potrace.texts.perform-iterative-subdivide-smooth-until-all-segments-are-shorter-than-this-length')">
          <n-input-number v-model:value="length_threshold" min="3.5" max="10" step="0.5" />
        </n-form-item>
        <n-form-item v-if="fitting === 'spline'" :label="$t('tools.potrace.texts.splice-threshold-more-accurate')" label-placement="left" :title="$t('tools.potrace.texts.minimum-angle-displacement-in-degrees-to-be-considered-a-cutting-point-between-curves')">
          <n-input-number v-model:value="splice_threshold" min="0" max="180" />
        </n-form-item>
      </n-space>
    </div>

    <n-space justify="center" mb-2>
      <n-button
        :disabled="!fileInput"
        @click="computeSVG"
      >
        {{ t('tools.potrace.texts.button-trace') }}
      </n-button>
    </n-space>

    <n-space v-if="processing" justify="center" mb-2>
      <n-spin />
    </n-space>

    <n-card v-if="svg && !processing" :title="t('tools.potrace.texts.tag-potrace-result')">
      <div style="text-align: center;">
        <img width="300" :src="svgBase64" style="background-color: white">
      </div>

      <n-divider />

      <TextareaCopyable
        :value="svg"
        word-wrap
        download-file-name="output.svg"
      />
    </n-card>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
