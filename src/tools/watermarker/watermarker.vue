<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  computed,
  ref,
} from 'vue';
import {
  NButton,
  NColorPicker,
  NInput,
  NRadio,
  NRadioGroup,
  NSelect,
  NSlider,
  NSpace,
  NSwitch,
  NUpload,
} from 'naive-ui';
import type { UploadFileInfo } from 'naive-ui';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const images = ref<HTMLImageElement[]>([]);
const selectedIndex = ref(0);

const watermarkText = useQueryParamOrStorage({ name: 'w', storageName: 'watermarker:w', defaultValue: 'Sample Watermark' });
const fontSize = useQueryParamOrStorage({ name: 'fs', storageName: 'watermarker:fs', defaultValue: 24 });
const fontColor = useQueryParamOrStorage({ name: 'col', storageName: 'watermarker:c', defaultValue: '#000000' });
const opacity = useQueryParamOrStorage({ name: 'opa', storageName: 'watermarker:o', defaultValue: 40 });
const rotation = useQueryParamOrStorage({ name: 'rot', storageName: 'watermarker:r', defaultValue: 45 });
const repeatWatermark = useQueryParamOrStorage({ name: 'repeat', storageName: 'watermarker:rep', defaultValue: false });
const logoWidth = useQueryParamOrStorage({ name: 'logow', storageName: 'watermarker:lw', defaultValue: 60 });
const tileSpacing = useQueryParamOrStorage({ name: 'tilespc', storageName: 'watermarker:ts', defaultValue: 30 });
const watermarkPosition = useQueryParamOrStorage({ name: 'pos', storageName: 'watermarker:pos', defaultValue: 'center' });

const logo = ref<HTMLImageElement | null>(null);
const downloadFormat = ref('png');

const canvas = ref<HTMLCanvasElement | null>(null);

const imageOptions = computed(() =>
  images.value.map((img, i) => ({ label: img.getAttribute('data-name'), value: i })),
);

function onFileChanges(uploadedFiles: File[]) {
  images.value = [];
  uploadedFiles.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.setAttribute('data-name', file.name);
      img.onload = () => {
        images.value.push(img);
        if (images.value.length === 1) {
          drawImage(0);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function onLogoUpload({ file }: { file: UploadFileInfo }) {
  if (!file.file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      logo.value = img;
    };
    img.src = reader.result as string;
  };
  reader.readAsDataURL(file.file);
}

function drawLogo(ctxRef: CanvasRenderingContext2D, textHeightOffset = 0) {
  if (!logo.value) {
    return;
  }
  const aspectRatio = logo.value.naturalHeight / logo.value.naturalWidth;
  const logoHeight = logoWidth.value * aspectRatio;
  ctxRef.drawImage(
    logo.value,
    -logoWidth.value / 2,
    textHeightOffset + 10,
    logoWidth.value,
    logoHeight,
  );
}

function drawImage(index: number) {
  const img = images.value[index];
  if (!img || !canvas.value) {
    return;
  }

  const ctx = canvas.value.getContext('2d');
  if (!ctx) {
    return;
  }

  canvas.value.width = img.width;
  canvas.value.height = img.height;

  ctx.clearRect(0, 0, img.width, img.height);
  ctx.drawImage(img, 0, 0);
  ctx.globalAlpha = opacity.value / 100;

  // Measure text
  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d')!;
  measureCtx.font = `${fontSize.value}px sans-serif`;

  const textMetrics = measureCtx.measureText(watermarkText.value);
  const textWidth = textMetrics.width;
  const textHeight = fontSize.value;

  const angle = (rotation.value * Math.PI) / 180;

  const rotatedWidth = Math.abs(textWidth * Math.cos(angle)) + Math.abs(textHeight * Math.sin(angle));
  const rotatedHeight = Math.abs(textWidth * Math.sin(angle)) + Math.abs(textHeight * Math.cos(angle));

  if (repeatWatermark.value) {
    // Create single watermark tile canvas
    const tileWidth = textWidth + tileSpacing.value;
    const tileHeight = textHeight + tileSpacing.value;

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d')!;
    offCanvas.width = tileWidth;
    offCanvas.height = tileHeight;

    offCtx.clearRect(0, 0, tileWidth, tileHeight);
    offCtx.font = `${fontSize.value}px sans-serif`;
    offCtx.fillStyle = fontColor.value;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.translate(tileWidth / 2, tileHeight / 2);
    offCtx.fillText(watermarkText.value, 0, 0);

    if (logo.value) {
      drawLogo(offCtx, textHeight / 2);
    }

    // create a repeated watermark canvas that covers image in diagonal
    const imageHypotenuseLength = Math.sqrt(img.width * img.width + img.height * img.height);
    const watermarkCanvas = document.createElement('canvas');
    const watermarkCtx = watermarkCanvas.getContext('2d')!;
    watermarkCanvas.width = imageHypotenuseLength;
    watermarkCanvas.height = imageHypotenuseLength;

    watermarkCtx.clearRect(0, 0, imageHypotenuseLength, imageHypotenuseLength);
    const pattern = watermarkCtx.createPattern(offCanvas, 'repeat');
    watermarkCtx.fillStyle = pattern!;
    watermarkCtx.fillRect(0, 0, imageHypotenuseLength, imageHypotenuseLength);

    ctx.save();
    ctx.translate(img.width / 2, img.height / 2);
    ctx.rotate(angle);

    ctx.drawImage(watermarkCanvas, -watermarkCanvas.width / 2, -watermarkCanvas.height / 2);

    ctx.restore();
  }
  else {
    ctx.save();

    let posX = img.width / 2;
    let posY = img.height / 2;
    const margin = tileSpacing.value;

    switch (watermarkPosition.value) {
      case 'top-left':
        posX = margin + rotatedWidth / 2;
        posY = margin + rotatedHeight / 2;
        break;
      case 'top-right':
        posX = img.width - margin - rotatedWidth / 2;
        posY = margin + rotatedHeight / 2;
        break;
      case 'bottom-left':
        posX = margin + rotatedWidth / 2;
        posY = img.height - margin - rotatedHeight / 2;
        break;
      case 'bottom-right':
        posX = img.width - margin - rotatedWidth / 2;
        posY = img.height - margin - rotatedHeight / 2;
        break;
  // default is center
    }

    ctx.translate(posX, posY);
    ctx.rotate(angle);

    drawLogo(ctx);

    ctx.font = `${fontSize.value}px sans-serif`;
    ctx.fillStyle = fontColor.value;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(watermarkText.value, 0, 0);
    ctx.restore();
  }

  ctx.globalAlpha = 1;
}

function applyWatermark() {
  drawImage(selectedIndex.value);
}

function downloadImage(index: number) {
  if (!canvas.value) {
    return;
  }
  const imgNameWithoutExt = images.value[index].getAttribute('data-name')?.replace(/\.[^\.]+$/, '');
  drawImage(index);
  const link = document.createElement('a');
  link.download = `watermarked-${imgNameWithoutExt}.${downloadFormat.value}`;
  link.href = canvas.value.toDataURL(`image/${downloadFormat.value}`);
  link.click();
}

function downloadAll() {
  images.value.forEach((_, index) => {
    downloadImage(index);
  });
  drawImage(selectedIndex.value);
}

watchEffect(() => drawImage(selectedIndex.value));
</script>

<template>
  <div>
    <c-file-upload
      :title="t('tools.watermarker.texts.title-drag-and-drop-images-here-or-click-to-select-some-files')"
      multiple
      accept="image/*"
      @files-upload="onFileChanges"
    />

    <NSelect
      v-if="images.length"
      v-model:value="selectedIndex"
      :options="imageOptions"
      label-field="label"
      value-field="value"
      mt-2
    />

    <div style="max-width: 100%; max-height: 50vh;overflow:scroll;text-align: center">
      <canvas
        ref="canvas"
        :style="`border:1px solid #ccc;display: ${images.length > 0 ? 'inline-block' : 'none'};`"
      />
    </div>

    <NSpace mt-2 justify="center">
      <NButton @click="applyWatermark">
        {{ t('tools.watermarker.texts.tag-apply-to-current') }}
      </NButton>
      <NButton @click="downloadImage(selectedIndex)">
        {{ t('tools.watermarker.texts.tag-download-current') }}
      </NButton>
      <NButton type="primary" @click="downloadAll">
        {{ t('tools.watermarker.texts.tag-apply-download-all') }}
      </NButton>
    </NSpace>

    <c-card :title="t('tools.watermarker.texts.title-settings')" mt-2>
      <n-form-item :label="t('tools.watermarker.texts.label-watermark-text')" label-placement="left" mt-2>
        <NInput v-model:value="watermarkText" :placeholder="t('tools.watermarker.texts.placeholder-watermark-text')" />
      </n-form-item>

      <NSpace justify="center">
        <n-form-item :label="t('tools.watermarker.texts.label-font-size')" label-placement="left" mt-2>
          <NSlider v-model:value="fontSize" :step="1" :min="1" :max="100" mr-2 />
          <n-input-number-i18n v-model:value="fontSize" size="small" :min="1" :max="100" />
        </n-form-item>

        <n-form-item :label="t('tools.watermarker.texts.label-opacity')" label-placement="left" mt-2>
          <NSlider v-model:value="opacity" :step="0.5" :min="0" :max="100" mr-2 />
          <n-input-number-i18n v-model:value="opacity" size="small" :min="0" :max="100" />
        </n-form-item>

        <n-form-item :label="t('tools.watermarker.texts.label-color')" label-placement="left" mt-2>
          <NColorPicker v-model:value="fontColor" style="width:100px" />
        </n-form-item>
        <n-form-item :label="t('tools.watermarker.texts.label-rotation')" label-placement="left" mt-2>
          <NSlider v-model:value="rotation" :step="0.5" :min="0" :max="360" mr-2 />
          <n-input-number-i18n v-model:value="rotation" size="small" :min="0" :max="360" />
        </n-form-item>
      </NSpace>

      <NSpace justify="center">
        <n-form-item :label="t('tools.watermarker.texts.label-repeat-watermark')" label-placement="left" mt-2>
          <NSwitch v-model:value="repeatWatermark" />
        </n-form-item>

        <n-form-item :label="repeatWatermark ? 'Tile spacing:' : 'Margin:'" label-placement="left" mt-2>
          <NSlider v-model:value="tileSpacing" :step="1" :min="1" :max="1000" mr-2 />
          <n-input-number-i18n v-model:value="tileSpacing" size="small" :min="1" :max="1000" />
        </n-form-item>

        <n-form-item v-if="!repeatWatermark" :label="t('tools.watermarker.texts.label-position')" label-placement="left" mt-2>
          <NSelect
            v-model:value="watermarkPosition"
            style="min-width: 130px"
            :options="[
              { label: t('tools.watermarker.texts.label-center'), value: 'center' },
              { label: t('tools.watermarker.texts.label-top-left'), value: 'top-left' },
              { label: t('tools.watermarker.texts.label-top-right'), value: 'top-right' },
              { label: t('tools.watermarker.texts.label-bottom-left'), value: 'bottom-left' },
              { label: t('tools.watermarker.texts.label-bottom-right'), value: 'bottom-right' },
            ]"
            :placeholder="t('tools.watermarker.texts.placeholder-watermark-position')"
          />
        </n-form-item>
      </NSpace>

      <c-card :title="t('tools.watermarker.texts.title-optional-logo')">
        <NSpace justify="center">
          <NUpload :show-file-list="false" accept="image/*" @change="onLogoUpload">
            <NButton>{{ t('tools.watermarker.texts.tag-upload-logo') }}</NButton>
          </NUpload>
        </NSpace>
        <n-form-item :label="t('tools.watermarker.texts.label-logo-width')" label-placement="left" mt-2>
          <NSlider v-model:value="logoWidth" :min="10" :max="200" mr-2 />
          <n-input-number-i18n v-model:value="logoWidth" size="small" :min="10" :max="200" />
        </n-form-item>
      </c-card>

      <c-card :title="t('tools.watermarker.texts.title-download-format')" mt-2>
        <NRadioGroup v-model:value="downloadFormat" name="format" flex justify-center>
          <NSpace>
            <NRadio value="png">
              {{ t('tools.watermarker.texts.tag-png') }}
            </NRadio>
            <NRadio value="jpeg">
              {{ t('tools.watermarker.texts.tag-jpeg') }}
            </NRadio>
          </NSpace>
        </NRadioGroup>
      </c-card>
    </c-card>
  </div>
</template>
