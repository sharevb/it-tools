<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import bwipjs, { type RenderOptions } from 'bwip-js/browser';
import { Base64 } from 'js-base64';
import formats from './barcode.formats.json';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const foreground = useQueryParamOrStorage({ name: 'fg', storageName: 'barcode-gen:fg', defaultValue: '#000000' });
const background = useQueryParamOrStorage({ name: 'bg', storageName: 'barcode-gen:bg', defaultValue: '#FFFFFF' });
const scale = useQueryParamOrStorage({ name: 'scale', storageName: 'barcode-gen:scale', defaultValue: 2 });
const height = useQueryParamOrStorage({ name: 'height', storageName: 'barcode-gen:height', defaultValue: 25 });
const margin = useQueryParamOrStorage({ name: 'margin', storageName: 'barcode-gen:margin', defaultValue: 10 });
const format = useQueryParamOrStorage({ name: 'format', storageName: 'barcode-gen:format', defaultValue: 'code128' });
const displayValue = useQueryParamOrStorage({ name: 'display', storageName: 'barcode-gen:display', defaultValue: true });
const value = ref('123456789');
const barcodeCanvas = ref<HTMLCanvasElement>();

const options = computed<RenderOptions>(() => ({
  barcolor: foreground.value,
  textcolor: foreground.value,
  backgroundcolor: background.value,
  scale: scale.value,
  height: height.value,
  padding: margin.value,
  bcid: format.value === 'auto' ? 'code128' : format.value,
  includetext: displayValue.value,
  text: value.value,
  textxalign: 'center',
}));

const error = ref('');
watchEffect(() => {
  if (!barcodeCanvas.value) {
    return;
  }

  try {
    bwipjs.toCanvas(barcodeCanvas.value, options.value);
  }
  catch (e: any) {
    error.value = e.toString();
  }
});

const barcodePNG = computed(() => {
  return barcodeCanvas.value?.toDataURL('image/png') || '';
});
const barcodeSVG = computed(() => {
  try {
    return Base64.encode(bwipjs.toSVG(options.value));
  }
  catch (e: any) {
    return '';
  }
});

const { download: downloadPNG } = useDownloadFileFromBase64({ source: barcodePNG, filename: 'barcode.png' });
const { download: downloadSVG } = useDownloadFileFromBase64({ source: barcodeSVG, filename: 'barcode.svg' });
</script>

<template>
  <c-card>
    <n-grid x-gap="12" y-gap="12" cols="1 600:3">
      <n-gi span="2">
        <c-input-text
          v-model:value="value"
          label-position="left"
          label-width="130px"
          label-align="right"
          :label="t('tools.barcode-generator.texts.label-text')"
          multiline
          rows="1"
          autosize
          :placeholder="t('tools.barcode-generator.texts.placeholder-your-barcode')"
          mb-6
        />
        <n-form label-width="130" label-placement="left">
          <c-select
            v-model:value="format"
            :label="t('tools.barcode-generator.texts.label-format')"
            label-position="left"
            label-width="130px"
            label-align="right"
            :options="formats"
            searchable
            mb-4
          />

          <n-form-item :label="t('tools.barcode-generator.texts.label-foreground-color')">
            <n-color-picker v-model:value="foreground" :modes="['hex']" :show-alpha="false" />
          </n-form-item>
          <n-form-item :label="t('tools.barcode-generator.texts.label-background-color')">
            <n-color-picker v-model:value="background" :modes="['hex']" :show-alpha="false" />
          </n-form-item>
          <n-form-item :label="t('tools.barcode-generator.texts.label-scale')">
            <n-input-number v-model:value="scale" :min="0" />
          </n-form-item>
          <n-form-item :label="t('tools.barcode-generator.texts.label-height-mm')">
            <n-input-number v-model:value="height" :min="0" />
          </n-form-item>
          <n-form-item :label="t('tools.barcode-generator.texts.label-margin')">
            <n-input-number v-model:value="margin" :min="0" />
          </n-form-item>
          <n-form-item :label="t('tools.barcode-generator.texts.label-display-text')">
            <n-checkbox v-model:checked="displayValue" />
          </n-form-item>
        </n-form>
      </n-gi>
      <n-gi>
        <div flex flex-col items-center gap-3>
          <c-alert v-if="error">
            {{ error }}
          </c-alert>
          <canvas ref="barcodeCanvas" />
          <div flex justify-center>
            <c-button mr-2 @click="downloadPNG">
              {{ t('tools.barcode-generator.texts.tag-download-png-barcode') }}
            </c-button>
            <c-button @click="downloadSVG">
              {{ t('tools.barcode-generator.texts.tag-download-svg-barcode') }}
            </c-button>
          </div>
        </div>
      </n-gi>
    </n-grid>
  </c-card>
</template>
