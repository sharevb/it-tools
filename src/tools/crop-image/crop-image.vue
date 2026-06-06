<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useElementSize } from '@vueuse/core';
import {
  Download,
  FlipHorizontal,
  FlipVertical,
  Focus,
  Maximize,
  Refresh,
  Rotate,
  RotateClockwise,
} from '@vicons/tabler';

import { getBaseDimensions, getViewportDimensions } from './crop-image.service';

const { t } = useI18n();

// Image references
const imageSrc = ref<string | null>(null);
const fileName = ref<string>('image');
const fileType = ref<string>('image/png');

// Image dimensions and position
const imgNaturalWidth = ref(0);
const imgNaturalHeight = ref(0);
const zoom = ref(1.0);
const rotation = ref(0); // in degrees
const offsetX = ref(0);
const offsetY = ref(0);
const flipH = ref(false);
const flipV = ref(false);

// Background and UI settings
const backgroundColor = ref('#00000000'); // hex or rgba/hsla
const aspectRatio = ref<string>('1'); // presets: '1', '1.777777778' (16:9), '0.5625' (9:16), '1.333333333' (4:3), '1.5' (3:2), 'original', 'free'
const customRatioWidth = ref(4);
const customRatioHeight = ref(3);
const showGrid = ref(true);

// Export settings
const exportFormat = ref<'png' | 'jpeg' | 'webp'>('png');
const exportQuality = ref(0.9);
const exportWidthMode = ref<'original' | 'viewport' | 'custom'>('original');
const customExportWidth = ref(1024);

// Dragging state
const isDragging = ref(false);
let startPointerX = 0;
let startPointerY = 0;
let startOffsetX = 0;
let startOffsetY = 0;

// Presets for aspect ratios
const aspectRatioOptions = computed(() => [
  { label: t('tools.crop-image.texts.ratio-square'), value: '1' },
  { label: t('tools.crop-image.texts.ratio-widescreen'), value: '1.777777778' },
  { label: t('tools.crop-image.texts.ratio-portrait'), value: '0.5625' },
  { label: t('tools.crop-image.texts.ratio-standard'), value: '1.333333333' },
  { label: t('tools.crop-image.texts.ratio-photo'), value: '1.5' },
  { label: t('tools.crop-image.texts.ratio-original'), value: 'original' },
  { label: t('tools.crop-image.texts.ratio-custom'), value: 'free' },
]);

const exportFormatOptions = [
  { label: 'PNG', value: 'png' },
  { label: 'JPEG', value: 'jpeg' },
  { label: 'WebP', value: 'webp' },
];

const exportWidthOptions = computed(() => [
  { label: t('tools.crop-image.texts.width-original'), value: 'original' },
  { label: t('tools.crop-image.texts.width-viewport'), value: 'viewport' },
  { label: t('tools.crop-image.texts.width-custom'), value: 'custom' },
]);

// Computed aspect ratio value
const currentRatio = computed(() => {
  if (aspectRatio.value === 'original') {
    if (imgNaturalWidth.value && imgNaturalHeight.value) {
      return imgNaturalWidth.value / imgNaturalHeight.value;
    }
    return 1;
  }
  if (aspectRatio.value === 'free') {
    const w = customRatioWidth.value || 1;
    const h = customRatioHeight.value || 1;
    return w / h;
  }
  return Number.parseFloat(aspectRatio.value);
});

// Viewport width and height (max bounded inside 450x450 box)
const maxViewportWidth = 450;
const maxViewportHeight = 450;

const viewportDimensions = computed(() => {
  return getViewportDimensions(currentRatio.value, maxViewportWidth, maxViewportHeight);
});

// Container ref and scale calculations for small viewports
const containerRef = ref<HTMLElement | null>(null);
const { width: containerWidth } = useElementSize(containerRef);

const scale = computed(() => {
  if (!containerWidth.value || !viewportDimensions.value.width) {
    return 1;
  }
  const maxWidth = Math.max(0, containerWidth.value - 8);
  return Math.min(1, maxWidth / viewportDimensions.value.width);
});

// Image base dimensions when fitting cover
const baseDimensions = computed(() => {
  return getBaseDimensions(
    viewportDimensions.value.width,
    viewportDimensions.value.height,
    imgNaturalWidth.value,
    imgNaturalHeight.value,
  );
});

// Reset image to center with cover scale
function resetPosition() {
  zoom.value = 1.0;
  rotation.value = 0;
  flipH.value = false;
  flipV.value = false;

  const vW = viewportDimensions.value.width;
  const vH = viewportDimensions.value.height;
  const bW = baseDimensions.value.width;

  offsetX.value = (vW - bW) / 2;
  offsetY.value = (vH - baseDimensions.value.height) / 2;
}

// Fit image entirely inside viewport
function fitToViewport() {
  if (!imgNaturalWidth.value || !imgNaturalHeight.value) {
    return;
  }

  rotation.value = 0;
  flipH.value = false;
  flipV.value = false;

  const vW = viewportDimensions.value.width;
  const vH = viewportDimensions.value.height;
  const iRatio = imgNaturalWidth.value / imgNaturalHeight.value;
  const vRatio = vW / vH;

  let bW = 0;

  if (iRatio > vRatio) {
    // Fit width
    bW = vW;
  }
  else {
    // Fit height
    bW = vH * iRatio;
  }

  zoom.value = bW / baseDimensions.value.width;
  offsetX.value = (vW - baseDimensions.value.width * zoom.value) / 2;
  offsetY.value = (vH - baseDimensions.value.height * zoom.value) / 2;
}

// Reset when image changes or viewport ratio changes
watch([imageSrc, aspectRatio], () => {
  nextTick(() => {
    resetPosition();
  });
});

// Drag and drop image upload
function onUpload(file: File) {
  if (!file) {
    return;
  }
  fileName.value = file.name;
  fileType.value = file.type;

  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      const img = new Image();
      img.onload = () => {
        imgNaturalWidth.value = img.naturalWidth;
        imgNaturalHeight.value = img.naturalHeight;
        imageSrc.value = e.target!.result as string;
      };
      img.src = e.target.result as string;
    }
  };
  reader.readAsDataURL(file);
}

// Handle mouse/touch drag events
function handlePointerDown(e: MouseEvent | TouchEvent) {
  if (!imageSrc.value) {
    return;
  }
  e.preventDefault();
  isDragging.value = true;

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

  startPointerX = clientX;
  startPointerY = clientY;
  startOffsetX = offsetX.value;
  startOffsetY = offsetY.value;

  window.addEventListener('mousemove', handlePointerMove);
  window.addEventListener('mouseup', handlePointerUp);
  window.addEventListener('touchmove', handlePointerMove, { passive: false });
  window.addEventListener('touchend', handlePointerUp);
}

function handlePointerMove(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) {
    return;
  }

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

  const dx = (clientX - startPointerX) / scale.value;
  const dy = (clientY - startPointerY) / scale.value;

  offsetX.value = startOffsetX + dx;
  offsetY.value = startOffsetY + dy;
}

function handlePointerUp() {
  isDragging.value = false;
  window.removeEventListener('mousemove', handlePointerMove);
  window.removeEventListener('mouseup', handlePointerUp);
  window.removeEventListener('touchmove', handlePointerMove);
  window.removeEventListener('touchend', handlePointerUp);
}

// Mouse wheel zoom
function handleWheel(e: WheelEvent) {
  if (!imageSrc.value) {
    return;
  }
  e.preventDefault();
  const zoomStep = 0.05;
  let newZoom = zoom.value;
  if (e.deltaY < 0) {
    newZoom = Math.min(zoom.value + zoomStep, 10.0);
  }
  else {
    newZoom = Math.max(zoom.value - zoomStep, 0.05);
  }
  zoom.value = newZoom;
}

// Draw to Canvas & Trigger Download
function exportImage() {
  if (!imageSrc.value) {
    return;
  }

  const img = new Image();
  img.onload = () => {
    const vW = viewportDimensions.value.width;
    const vH = viewportDimensions.value.height;

    let canvasWidth = vW;
    let canvasHeight = vH;

    if (exportWidthMode.value === 'original') {
      const bW = baseDimensions.value.width;
      const scaleFactor = imgNaturalWidth.value / bW;
      canvasWidth = vW * scaleFactor;
      canvasHeight = vH * scaleFactor;
    }
    else if (exportWidthMode.value === 'custom') {
      canvasWidth = customExportWidth.value;
      canvasHeight = customExportWidth.value / currentRatio.value;
    }

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Background color
    if (backgroundColor.value !== '#00000000') {
      ctx.fillStyle = backgroundColor.value;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    else {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    // Replicate CSS: transform-origin center center on an element of size (bW x bH)
    // CSS computes: T(origin) · translate(ox, oy) · rotate(r) · scale(sx, sy) · T(-origin)
    // We scale from viewport coordinates to canvas coordinates first.
    const scaleFactor = canvasWidth / vW;
    const bW = baseDimensions.value.width;
    const bH = baseDimensions.value.height;
    const ox = offsetX.value;
    const oy = offsetY.value;
    const r = rotation.value * Math.PI / 180;
    const sx = zoom.value * (flipH.value ? -1 : 1);
    const sy = zoom.value * (flipV.value ? -1 : 1);

    ctx.save();
    ctx.scale(scaleFactor, scaleFactor); // viewport → canvas coords
    ctx.translate(bW / 2, bH / 2); // T(origin)
    ctx.translate(ox, oy); // CSS translate
    ctx.rotate(r); // CSS rotate
    ctx.scale(sx, sy); // CSS scale (includes flip)
    ctx.translate(-bW / 2, -bH / 2); // T(-origin)
    ctx.drawImage(img, 0, 0, bW, bH); // draw at element's natural position
    ctx.restore();

    // Trigger Download
    const mime = exportFormat.value === 'jpeg' ? 'image/jpeg' : exportFormat.value === 'webp' ? 'image/webp' : 'image/png';
    const extension = exportFormat.value;
    const dataUrl = canvas.toDataURL(mime, exportQuality.value);

    const link = document.createElement('a');
    link.href = dataUrl;

    let baseName = fileName.value || 'image';
    if (baseName.includes('.')) {
      baseName = baseName.substring(0, baseName.lastIndexOf('.'));
    }
    link.download = `${baseName}_cropped.${extension}`;
    link.click();
  };
  img.src = imageSrc.value;
}
</script>

<template>
  <div>
    <!-- Drop Zone Mode -->
    <c-card v-if="!imageSrc">
      <div flex flex-col items-center justify-center gap-6 py-12>
        <c-file-upload
          accept="image/*"
          :title="t('tools.crop-image.texts.drag-drop')"
          w-full
          @file-upload="onUpload"
        />
      </div>
    </c-card>

    <!-- Interactive Cropper Mode -->
    <n-grid v-else cols="1 900:12" x-gap="24" y-gap="24">
      <!-- Left Column: Viewport & Canvas transformations -->
      <n-gi span="1 900:5">
        <c-card>
          <div w-full flex flex-col items-center>
            <div ref="containerRef" w-full flex items-center justify-center>
              <div
                class="viewport-box-wrapper"
                :style="{
                  width: `${viewportDimensions.width * scale}px`,
                  height: `${viewportDimensions.height * scale}px`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }"
              >
                <div
                  class="viewport-box relative cursor-move select-none overflow-hidden border-2 border-gray-300 rounded-lg shadow-lg transition-all duration-200 dark:border-gray-600"
                  :style="{
                    width: `${viewportDimensions.width}px`,
                    height: `${viewportDimensions.height}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    flexShrink: 0,
                    backgroundColor,
                  }"
                  @mousedown="handlePointerDown"
                  @touchstart="handlePointerDown"
                  @wheel="handleWheel"
                >
                  <!-- Transparent checkerboard background -->
                  <div
                    v-if="backgroundColor === '#00000000' || backgroundColor.includes('rgba(') && backgroundColor.endsWith(', 0)')"
                    class="checkerboard-bg pointer-events-none absolute inset-0"
                  />

                  <!-- The transformable image -->
                  <img
                    :src="imageSrc"
                    class="pointer-events-none absolute"
                    :style="{
                      width: `${baseDimensions.width}px`,
                      height: `${baseDimensions.height}px`,
                      transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${zoom * (flipH ? -1 : 1)}, ${zoom * (flipV ? -1 : 1)})`,
                      transformOrigin: 'center center',
                    }"
                  >

                  <!-- 3x3 rule of thirds grid overlay -->
                  <div
                    v-if="showGrid"
                    class="grid-overlay pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 border border-white/20"
                  >
                    <div class="border-b border-r border-white/20 border-dashed" />
                    <div class="border-b border-r border-white/20 border-dashed" />
                    <div class="border-b border-white/20 border-dashed" />
                    <div class="border-b border-r border-white/20 border-dashed" />
                    <div class="border-b border-r border-white/20 border-dashed" />
                    <div class="border-b border-white/20 border-dashed" />
                    <div class="border-r border-white/20 border-dashed" />
                    <div class="border-r border-white/20 border-dashed" />
                    <div />
                  </div>
                </div>
              </div>
            </div>

            <!-- Viewport Hint -->
            <div mt-3 text-center text-xs text-gray-400>
              {{ t('tools.crop-image.texts.drag-hint', { zoom: Math.round(zoom * 100) }) }}
            </div>

            <!-- Quick Action Transform Buttons -->
            <div mt-5 flex flex-wrap justify-center gap-2>
              <c-button size="small" @click="rotation -= 90">
                <n-icon :component="Rotate" class="mr-1" />
                -90°
              </c-button>
              <c-button size="small" @click="rotation += 90">
                <n-icon :component="RotateClockwise" class="mr-1" />
                +90°
              </c-button>
              <c-button size="small" @click="flipH = !flipH">
                <n-icon :component="FlipHorizontal" class="mr-1" />
                {{ t('tools.crop-image.texts.flip-h') }}
              </c-button>
              <c-button size="small" @click="flipV = !flipV">
                <n-icon :component="FlipVertical" class="mr-1" />
                {{ t('tools.crop-image.texts.flip-v') }}
              </c-button>
              <c-button size="small" @click="resetPosition">
                <n-icon :component="Focus" class="mr-1" />
                {{ t('tools.crop-image.texts.reset') }}
              </c-button>
              <c-button size="small" @click="fitToViewport">
                <n-icon :component="Maximize" class="mr-1" />
                {{ t('tools.crop-image.texts.fit') }}
              </c-button>
            </div>
          </div>
        </c-card>
      </n-gi>

      <!-- Right Column: Settings, Customizer and Download actions -->
      <n-gi span="1 900:7">
        <c-card>
          <div flex flex-col gap-6>
            <!-- Header actions -->
            <div flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700>
              <div text-lg font-bold class="max-w-220px truncate">
                {{ fileName }}
              </div>
              <c-button type="warning" size="small" @click="imageSrc = null">
                <n-icon :component="Refresh" class="mr-1" />
                {{ t('tools.crop-image.texts.change-image') }}
              </c-button>
            </div>

            <n-form label-placement="left" label-width="140" label-align="right">
              <!-- Aspect Ratio Presets -->
              <n-form-item :label="t('tools.crop-image.texts.aspect-ratio')">
                <c-select
                  v-model:value="aspectRatio"
                  :options="aspectRatioOptions"
                  w-full
                />
              </n-form-item>

              <!-- Custom Aspect Ratio Inputs -->
              <n-form-item v-if="aspectRatio === 'free'" :label="t('tools.crop-image.texts.custom-ratio')">
                <div w-full flex items-center gap-3>
                  <n-input-number v-model:value="customRatioWidth" :min="1" placeholder="W" class="flex-1" />
                  <span font-bold text-gray-400>:</span>
                  <n-input-number v-model:value="customRatioHeight" :min="1" placeholder="H" class="flex-1" />
                </div>
              </n-form-item>

              <!-- Background Color Picker -->
              <n-form-item :label="t('tools.crop-image.texts.background-color')">
                <div w-full flex items-center gap-4>
                  <n-color-picker v-model:value="backgroundColor" :modes="['hex', 'rgba']" class="flex-1" />
                  <c-button size="small" @click="backgroundColor = '#00000000'">
                    {{ t('tools.crop-image.texts.transparent') }}
                  </c-button>
                </div>
              </n-form-item>

              <!-- Interactive Zoom Slider -->
              <n-form-item :label="t('tools.crop-image.texts.zoom-image')">
                <div w-full flex items-center gap-4>
                  <n-slider v-model:value="zoom" :min="0.1" :max="5" :step="0.01" class="flex-1" />
                  <span w-50px text-right font-mono>{{ Math.round(zoom * 100) }}%</span>
                </div>
              </n-form-item>

              <!-- Interactive Rotation Slider -->
              <n-form-item :label="t('tools.crop-image.texts.rotate-image')">
                <div w-full flex items-center gap-4>
                  <n-slider v-model:value="rotation" :min="-180" :max="180" :step="1" class="flex-1" />
                  <span w-50px text-right font-mono>{{ rotation }}°</span>
                </div>
              </n-form-item>

              <!-- Toggle Grid lines -->
              <n-form-item :label="t('tools.crop-image.texts.rule-of-thirds-grid')">
                <n-switch v-model:value="showGrid" />
              </n-form-item>
            </n-form>

            <n-divider class="my-2" />

            <div text-md mb-2 font-bold>
              {{ t('tools.crop-image.texts.export-settings') }}
            </div>

            <n-form label-placement="left" label-width="140" label-align="right">
              <!-- Export Format select -->
              <n-form-item :label="t('tools.crop-image.texts.export-format')">
                <c-select
                  v-model:value="exportFormat"
                  :options="exportFormatOptions"
                  w-full
                />
              </n-form-item>

              <!-- Quality slider for lossy formats -->
              <n-form-item v-if="exportFormat === 'jpeg' || exportFormat === 'webp'" :label="t('tools.crop-image.texts.image-quality')">
                <div w-full flex items-center gap-4>
                  <n-slider v-model:value="exportQuality" :min="0.1" :max="1" :step="0.05" class="flex-1" />
                  <span w-50px text-right font-mono>{{ Math.round(exportQuality * 100) }}%</span>
                </div>
              </n-form-item>

              <!-- Export width options -->
              <n-form-item :label="t('tools.crop-image.texts.export-width')">
                <c-select
                  v-model:value="exportWidthMode"
                  :options="exportWidthOptions"
                  w-full
                />
              </n-form-item>

              <!-- Custom Export Width Input -->
              <n-form-item v-if="exportWidthMode === 'custom'" :label="t('tools.crop-image.texts.custom-width')">
                <n-input-number v-model:value="customExportWidth" :min="10" :max="10000" w-full />
              </n-form-item>
            </n-form>

            <!-- Big Download/Cropped Image Button -->
            <c-button type="primary" size="large" class="mt-4 w-full" @click="exportImage">
              <n-icon :component="Download" class="mr-2 text-lg" />
              {{ t('tools.crop-image.texts.export-download-image') }}
            </c-button>
          </div>
        </c-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<style lang="less" scoped>
.viewport-box {
  background-color: #f3f4f6;
}

.checkerboard-bg {
  background-image:
    linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
    linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
    linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0px;

  :deep(.dark) &, .dark & {
    background-image:
      linear-gradient(45deg, #374151 25%, transparent 25%),
      linear-gradient(-45deg, #374151 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #374151 75%),
      linear-gradient(-45deg, transparent 75%, #374151 75%);
  }
}

.grid-overlay {
  & > div {
    box-sizing: border-box;
  }
}
</style>
