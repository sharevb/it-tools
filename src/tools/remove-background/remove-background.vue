<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import type { BackgroundRemovalPipeline, ProgressInfo } from '@huggingface/transformers';
import { RawImage, pipeline } from '@huggingface/transformers';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const inputImage = ref<File | null>(null);
const inputUrl = ref<string | null>(null);
const outputUrl = ref<string | null>(null);
const loading = ref(false);
const error = ref('');

const webgpuAvailable = ref(false);

const selectedModel = useQueryParamOrStorage({ name: 'model', storageName: 'rmbg:m', defaultValue: 'rmbg' });
const modelOptions = [
  { label: t('tools.remove-background.texts.label-rmbg-1-4-cpu-wasm'), value: 'rmbg' },
  { label: t('tools.remove-background.texts.label-modnet-webgpu'), value: 'modnet' },
];

const backgroundMode = useQueryParamOrStorage({ name: 'bgmode', storageName: 'rmbg:bgm', defaultValue: 'transparent' });
const backgroundOptions = [
  { label: t('tools.remove-background.texts.label-transparent'), value: 'transparent' },
  { label: t('tools.remove-background.texts.label-solid-color'), value: 'color' },
  { label: t('tools.remove-background.texts.label-pattern'), value: 'pattern' },
  { label: t('tools.remove-background.texts.label-blurred-original'), value: 'blur' },
  { label: t('tools.remove-background.texts.label-adjust-contrast-brightness'), value: 'adjust' },
];

const backgroundColor = useQueryParamOrStorage({ name: 'model', storageName: 'rmbg:bg', defaultValue: '#ffffff' });
const patternName = useQueryParamOrStorage({ name: 'pattern', storageName: 'rmbg:pa', defaultValue: 'stripes' });
const patternOptions = [
  { label: t('tools.remove-background.texts.label-diagonal-stripes'), value: 'stripes' },
  { label: t('tools.remove-background.texts.label-dots'), value: 'dots' },
  { label: t('tools.remove-background.texts.label-checkerboard'), value: 'checker' },
];

const blurAmount = useQueryParamOrStorage({ name: 'blur', storageName: 'rmbg:bl', defaultValue: 12 });
const contrast = useQueryParamOrStorage({ name: 'contrast', storageName: 'rmbg:co', defaultValue: 1 });
const brightness = useQueryParamOrStorage({ name: 'bright', storageName: 'rmbg:br', defaultValue: 1 });

const modelLoading = ref(false);
const modelLoadingProgress = ref(0);

let rmbgPipeline: BackgroundRemovalPipeline | null = null;
let modnetPipeline: BackgroundRemovalPipeline | null = null;

onMounted(() => {
  webgpuAvailable.value = !!navigator.gpu;
});

async function onUpload(file: File) {
  inputImage.value = file;
  inputUrl.value = URL.createObjectURL(file);
  outputUrl.value = null;
}

async function loadPipelines() {
  if (rmbgPipeline && (selectedModel.value !== 'modnet' || modnetPipeline)) {
    return;
  }

  modelLoading.value = true;
  modelLoadingProgress.value = 0;

  const update = (p: ProgressInfo) => {
    // @ts-expect-error: progress check
    if (p && typeof p.progress === 'number') {
      // @ts-expect-error: progress check
      modelLoadingProgress.value = Math.round(p.progress * 100);
    }
  };

  if (!rmbgPipeline) {
    // @ts-expect-error Probably a Typescript bug 'too complex type'
    rmbgPipeline = await pipeline(
      'background-removal',
      'briaai/RMBG-1.4',
      { progress_callback: update },
    );
  }

  if (webgpuAvailable.value && selectedModel.value === 'modnet' && !modnetPipeline) {
    modnetPipeline = await pipeline(
      'background-removal',
      'Xenova/modnet',
      { device: 'webgpu', progress_callback: update },
    );
  }

  modelLoading.value = false;
  modelLoadingProgress.value = 100;
}

const backgroundRenderers = {
  transparent(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.clearRect(0, 0, w, h);
  },

  color(ctx: CanvasRenderingContext2D, w: number, h: number, opts: { backgroundColor: string }) {
    ctx.fillStyle = opts.backgroundColor;
    ctx.fillRect(0, 0, w, h);
  },

  pattern(ctx: CanvasRenderingContext2D, w: number, h: number, opts: { patternName: string }) {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 40;
    pCanvas.height = 40;
    const pCtx = pCanvas.getContext('2d')!;

    if (opts.patternName === 'stripes') {
      pCtx.fillStyle = '#ddd';
      pCtx.fillRect(0, 0, 40, 40);
      pCtx.strokeStyle = '#aaa';
      pCtx.lineWidth = 6;
      pCtx.beginPath();
      pCtx.moveTo(0, 40);
      pCtx.lineTo(40, 0);
      pCtx.stroke();
    }

    if (opts.patternName === 'dots') {
      pCtx.fillStyle = '#eee';
      pCtx.fillRect(0, 0, 40, 40);
      pCtx.fillStyle = '#bbb';
      pCtx.beginPath();
      pCtx.arc(20, 20, 6, 0, Math.PI * 2);
      pCtx.fill();
    }

    if (opts.patternName === 'checker') {
      pCtx.fillStyle = '#fff';
      pCtx.fillRect(0, 0, 40, 40);
      pCtx.fillStyle = '#ccc';
      pCtx.fillRect(0, 0, 20, 20);
      pCtx.fillRect(20, 20, 20, 20);
    }

    const pattern = ctx.createPattern(pCanvas, 'repeat');
    ctx.fillStyle = pattern!;
    ctx.fillRect(0, 0, w, h);
  },

  blur(ctx: CanvasRenderingContext2D, w: number, h: number, opts: { blurAmount: number }, originalImage: CanvasImageSource) {
    ctx.filter = `blur(${opts.blurAmount}px)`;
    ctx.drawImage(originalImage, 0, 0, w, h);
    ctx.filter = 'none';
  },

  adjust(ctx: CanvasRenderingContext2D, w: number, h: number, opts: { contrast: number; brightness: number }, originalImage: CanvasImageSource) {
    ctx.filter = `contrast(${opts.contrast}) brightness(${opts.brightness})`;
    ctx.drawImage(originalImage, 0, 0, w, h);
    ctx.filter = 'none';
  },
} as unknown as { [index: string]: (ctx: CanvasRenderingContext2D, w: number, h: number, opts: any, originalImage: CanvasImageSource) => void };

function rawImageToCanvas(raw: RawImage) {
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = raw.width;
  canvas.height = raw.height;

  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(raw.width, raw.height);

  const { data, width, height, channels } = raw;

  // Fill ImageData (always RGBA)
  for (let i = 0, j = 0; i < width * height; i++) {
    const r = data[i * channels + 0] ?? 0;
    const g = data[i * channels + 1] ?? 0;
    const b = data[i * channels + 2] ?? 0;
    const a = channels === 4 ? data[i * channels + 3] : 255;

    imageData.data[j++] = r;
    imageData.data[j++] = g;
    imageData.data[j++] = b;
    imageData.data[j++] = a;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

async function removeBackground() {
  if (!inputImage.value) {
    return;
  }

  error.value = '';
  loading.value = true;

  try {
    await loadPipelines();

    const file = inputImage.value;
    const originalImage = await createImageBitmap(file);
    const imageBitmap = await RawImage.fromBlob(file)!;

    let results: RawImage[];
    if (selectedModel.value === 'modnet' && webgpuAvailable.value) {
      results = await modnetPipeline!(imageBitmap);
    }
    else {
      results = await rmbgPipeline!(imageBitmap);
    }

    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext('2d')!;

    // 1. Draw background
    backgroundRenderers[backgroundMode.value](
      ctx,
      canvas.width,
      canvas.height,
      {
        backgroundColor: backgroundColor.value,
        patternName: patternName.value,
        blurAmount: blurAmount.value,
        contrast: contrast.value,
        brightness: brightness.value,
      },
      originalImage,
    );

    ctx.drawImage(rawImageToCanvas(results[0]), 0, 0, canvas.width, canvas.height);

    outputUrl.value = canvas.toDataURL('image/png')!;
  }
  catch (e: any) {
    error.value = e.toString();
  }

  loading.value = false;
}

function downloadResult() {
  const a = document.createElement('a');
  a.href = outputUrl.value!;
  a.download = `${inputImage.value?.name || 'edited'}.png`;
  a.click();
}
</script>

<template>
  <div>
    <c-file-upload
      :title="t('tools.remove-background.texts.title-drag-and-drop-an-image-or-click-to-select')"
      paste-image
      accept="image/*"
      mb-3
      @file-upload="onUpload"
    />

    <n-form label-placement="left">
      <n-form-item v-if="webgpuAvailable" :label="t('tools.remove-background.texts.label-model')">
        <n-select
          v-model:value="selectedModel"
          :options="modelOptions"
        />
      </n-form-item>

      <n-form-item :label="t('tools.remove-background.texts.label-model')">
        <n-select
          v-model:value="backgroundMode"
          :options="backgroundOptions"
        />
      </n-form-item>

      <n-form-item v-if="backgroundMode === 'color'" :label="t('tools.remove-background.texts.label-model')">
        <n-color-picker
          v-model:value="backgroundColor"
        />
      </n-form-item>

      <n-form-item v-if="backgroundMode === 'pattern'" :label="t('tools.remove-background.texts.label-pattern')">
        <n-select
          v-model:value="patternName"
          :options="patternOptions"
        />
      </n-form-item>

      <n-form-item v-if="backgroundMode === 'blur'" :label="t('tools.remove-background.texts.label-blur')">
        <n-slider
          v-model:value="blurAmount"
          :min="0"
          :max="40"
        />
      </n-form-item>

      <div v-if="backgroundMode === 'adjust'">
        <n-form-item :label="t('tools.remove-background.texts.label-contrast')">
          <n-slider v-model:value="contrast" :min="0.5" :max="2" :step="0.01" />
        </n-form-item>

        <n-form-item :label="t('tools.remove-background.texts.label-brightness')">
          <n-slider v-model:value="brightness" :min="0.5" :max="2" :step="0.01" />
        </n-form-item>
      </div>
    </n-form>

    <n-progress
      v-if="modelLoading"
      type="line"
      :percentage="modelLoadingProgress"
      indicator-placement="inside"
      processing
    />

    <n-space justify="center" mb-1>
      <n-spin :show="loading" mb-1>
        <n-button
          type="success"
          :disabled="!inputImage"
          @click="removeBackground"
        >
          {{ t('tools.remove-background.texts.tag-apply-background') }}
        </n-button>
      </n-spin>
    </n-space>

    <c-alert v-if="error" mb-1>
      {{ error }}
    </c-alert>

    <n-space v-if="outputUrl" justify="center">
      <n-button @click="downloadResult">
        {{ t('tools.remove-background.texts.tag-download-result') }}
      </n-button>
    </n-space>

    <n-space justify="center" mr-1>
      <NCard v-if="inputUrl" :title="t('tools.remove-background.texts.title-original')">
        <n-image :src="inputUrl" width="260" />
      </NCard>

      <NCard v-if="outputUrl" :title="t('tools.remove-background.texts.title-result')">
        <n-image :src="outputUrl" width="260" />
      </NCard>
    </n-space>
  </div>
</template>
