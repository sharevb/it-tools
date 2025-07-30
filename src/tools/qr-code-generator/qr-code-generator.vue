<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  ErrorCorrectionLevel,
  FileExtension,
} from 'pp-qr-code';
import qrcodeConsole from 'qrcode-terminal-nooctal';
import { useQRCodeStyling } from './useQRCode';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const foreground = useQueryParamOrStorage({ name: 'fg', storageName: 'qr-code-gen:fg', defaultValue: '#000000ff' });
const background = useQueryParamOrStorage({ name: 'bg', storageName: 'qr-code-gen:bg', defaultValue: '#ffffffff' });
const errorCorrectionLevelSelectValue = useQueryParamOrStorage<string>({ name: 'level', storageName: 'qr-code-gen:level', defaultValue: 'medium' });
const errorCorrectionLevel = computed(() => errorCorrectionLevelSelectValue.value.toString()[0].toUpperCase() as ErrorCorrectionLevel);
const width = useQueryParamOrStorage({ name: 'width', storageName: 'qr-code-gen:width', defaultValue: 1024 });
const margin = useQueryParamOrStorage({ name: 'margin', storageName: 'qr-code-gen:margin', defaultValue: 10 });
const imageSize = useQueryParamOrStorage({ name: 'imgsize', storageName: 'qr-code-gen:imsz', defaultValue: 0.4 });
const imageMargin = useQueryParamOrStorage({ name: 'imgmargin', storageName: 'qr-code-gen:immg', defaultValue: 20 });
const outputType = useQueryParamOrStorage<FileExtension>({ name: 'out', storageName: 'qr-code-gen:out', defaultValue: 'png' });
const dotType = useQueryParamOrStorage<DotType>({ name: 'dot', storageName: 'qr-code-gen:dot', defaultValue: 'square' });
const dotColor = useQueryParamOrStorage<string>({ name: 'dotc', storageName: 'qr-code-gen:dotc', defaultValue: '#ffffffff' });
const cornersDotType = useQueryParamOrStorage<CornerDotType>({ name: 'cdt', storageName: 'qr-code-gen:cdt', defaultValue: 'square' });
const cornersDotColor = useQueryParamOrStorage<string>({ name: 'cdtc', storageName: 'qr-code-gen:cdtc', defaultValue: '#ffffffff' });
const cornersSquareType = useQueryParamOrStorage<CornerSquareType>({ name: 'cst', storageName: 'qr-code-gen:cst', defaultValue: 'square' });
const cornersSquareColor = useQueryParamOrStorage<string>({ name: 'cstc', storageName: 'qr-code-gen:cstc', defaultValue: '#ffffffff' });
const smallTerminal = useQueryParamOrStorage<boolean>({ name: 'sml', storageName: 'qr-code-gen:sml', defaultValue: false });
const fileInput = ref() as Ref<File>;
const { base64: imageBase64 } = useBase64(fileInput);
async function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}

const errorCorrectionLevels = ['low', 'medium', 'quartile', 'high'];
const outputTypes = ['svg', 'png', 'jpeg', 'webp'];
const dotTypes = ['dots',
  'random-dots',
  'rounded',
  'vertical-lines',
  'horizontal-lines',
  'classy',
  'classy-rounded',
  'square',
  'extra-rounded'];
const cornersDotTypes = ['dot', 'square', 'heart'];
const cornersSquareTypes = ['dot', 'square', 'extra-rounded'];

const text = ref('https://sharevb-it-tools.vercel.app');
const { qrcode } = useQRCodeStyling({
  text,
  color: { background, foreground },
  errorCorrectionLevel,
  imageBase64,
  imageOptions: { imageSize, margin: imageMargin },
  dotOptions: { type: dotType, color: dotColor },
  cornersSquareOptions: { type: cornersSquareType, color: cornersSquareColor },
  cornersDotOptions: { type: cornersDotType, color: cornersDotColor },
  outputType,
  width,
  margin,
});

const qrcodeTerminal = computedAsync(() => {
  const textValue = text.value;
  const level = errorCorrectionLevel.value;
  const small = smallTerminal.value;
  return new Promise<string>((resolve, _reject) => {
    try {
      qrcodeConsole.setErrorLevel(level);
      qrcodeConsole.generate(textValue, { small }, (qrcode: string) => {
        resolve(qrcode);
      });
    }
    catch (_) {
      resolve('');
    }
  });
});

const filename = ref('qr-code');
const extension = computed(() => {
  // Explicitly access the reactive value
  const type = outputType.value;
  return type.toString();
});
const { download } = useDownloadFileFromBase64({ source: qrcode, filename, extension });

const isCopied = ref(false);

async function copyQRCode() {
  try {
    // Convert base64 to blob
    const response = await fetch(qrcode.value);
    const blob = await response.blob();

    // Convert to PNG if it's not already PNG for clipboard compatibility
    let clipboardBlob = blob;
    if (blob.type !== 'image/png') {
      // Create a canvas to convert the image to PNG
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      await new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((pngBlob) => {
            if (pngBlob) {
              clipboardBlob = pngBlob;
            }
            resolve(undefined);
          }, 'image/png');
        };
        img.src = qrcode.value;
      });
    }

    // Copy to clipboard using the Clipboard API
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': clipboardBlob,
      }),
    ]);

    // Show success feedback
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000); // Reset after 2 seconds
  }
  catch (error) {
    console.error('Failed to copy QR code:', error);
    // Show error feedback and reset
    isCopied.value = false;
  }
}
</script>

<template>
  <c-card>
    <n-grid x-gap="12" y-gap="12" cols="1 600:3">
      <n-gi span="2">
        <c-input-text
          v-model:value="text"
          label-position="left"
          label-width="130px"
          label-align="right"
          :label="t('tools.qr-code-generator.texts.label-text')"
          rows="1"
          :placeholder="t('tools.qr-code-generator.texts.placeholder-your-link-or-text')"
          autosize mb-6
        />
        <n-form label-width="130" label-placement="left">
          <n-form-item :label="t('tools.qr-code-generator.texts.label-foreground-color')">
            <n-color-picker v-model:value="foreground" :modes="['hex']" />
          </n-form-item>
          <n-form-item :label="t('tools.qr-code-generator.texts.label-background-color')">
            <n-color-picker v-model:value="background" :modes="['hex']" />
          </n-form-item>
          <n-form-item :label="t('tools.qr-code-generator.texts.label-width')">
            <n-input-number v-model:value="width" :min="0" />
          </n-form-item>
          <n-form-item :label="t('tools.qr-code-generator.texts.label-margin')">
            <n-input-number v-model:value="margin" :min="0" />
          </n-form-item>
          <c-select
            v-model:value="errorCorrectionLevelSelectValue"
            :label="t('tools.qr-code-generator.texts.label-error-resistance')"
            label-position="left"
            label-width="130px"
            label-align="right"
            :options="errorCorrectionLevels.map((value) => ({ label: value, value }))"
          />
          <c-select
            v-model:value="outputType"
            mt-3
            :label="t('tools.qr-code-generator.texts.label-output-format')"
            label-position="left"
            label-width="130px"
            label-align="right"
            :options="outputTypes.map((value) => ({ label: value.toUpperCase(), value }))"
          />
        </n-form>
        <c-card :title="t('tools.qr-code-generator.texts.title-image')" mt-3>
          <c-file-upload :title="t('tools.qr-code-generator.texts.title-drag-and-drop-an-image-here-or-click-to-select-an-image')" @file-upload="onUpload" />

          <n-form label-width="130" label-placement="left" mt-3>
            <n-form-item :label="t('tools.qr-code-generator.texts.label-size')">
              <n-input-number v-model:value="imageSize" :min="0" step="0.1" />
            </n-form-item>
            <n-form-item :label="t('tools.qr-code-generator.texts.label-margin')">
              <n-input-number v-model:value="imageMargin" :min="0" />
            </n-form-item>
          </n-form>
        </c-card>
        <c-card mt-3>
          <details>
            <summary>{{ t('tools.qr-code-generator.texts.tag-dots-options') }}</summary>
            <n-form label-width="130" label-placement="left">
              <n-form-item :label="t('tools.qr-code-generator.texts.label-color')">
                <n-color-picker v-model:value="dotColor" :modes="['hex']" />
              </n-form-item>
              <c-select
                v-model:value="dotType"
                :label="t('tools.qr-code-generator.texts.label-type')"
                label-position="left"
                label-width="130px"
                label-align="right"
                :options="dotTypes.map((value) => ({ label: value, value }))"
              />
            </n-form>
          </details>
        </c-card>
        <c-card mt-3>
          <details>
            <summary>{{ t('tools.qr-code-generator.texts.tag-corners-dots-options') }}</summary>
            <n-form label-width="130" label-placement="left">
              <n-form-item :label="t('tools.qr-code-generator.texts.label-color')">
                <n-color-picker v-model:value="cornersDotColor" :modes="['hex']" />
              </n-form-item>
              <c-select
                v-model:value="cornersDotType"
                :label="t('tools.qr-code-generator.texts.label-type')"
                label-position="left"
                label-width="130px"
                label-align="right"
                :options="cornersDotTypes.map((value) => ({ label: value, value }))"
              />
            </n-form>
          </details>
        </c-card>
        <c-card mt-3>
          <details>
            <summary>{{ t('tools.qr-code-generator.texts.tag-corners-square-options') }}</summary>
            <n-form label-width="130" label-placement="left">
              <n-form-item :label="t('tools.qr-code-generator.texts.label-color')">
                <n-color-picker v-model:value="cornersSquareColor" :modes="['hex']" />
              </n-form-item>
              <c-select
                v-model:value="cornersSquareType"
                :label="t('tools.qr-code-generator.texts.label-type')"
                label-position="left"
                label-width="130px"
                label-align="right"
                :options="cornersSquareTypes.map((value) => ({ label: value, value }))"
              />
            </n-form>
          </details>
        </c-card>
      </n-gi>
      <n-gi>
        <div flex flex-col items-center gap-3>
          <n-image :src="qrcode" width="250" />
          <div flex gap-3>
            <c-button @click="copyQRCode">
              {{ isCopied ? 'Copied!' : 'Copy' }}
              <icon-mdi-check v-if="isCopied" ml-2 style="color: #10b981;" />
              <icon-mdi-content-copy v-else ml-2 />
            </c-button>
            <c-button @click="download">
              Download ({{ outputType.toString().toUpperCase() }})
              <icon-mdi-download ml-2 />
            </c-button>
          </div>
        </div>

        <n-divider />

        <n-checkbox v-model:checked="smallTerminal">
          {{ t('tools.qr-code-generator.texts.tag-small-terminal') }}
        </n-checkbox>
        <n-form-item :label="t('tools.qr-code-generator.texts.label-terminal-output')" mt-1>
          <TextareaCopyable
            :value="qrcodeTerminal"
            multiline
            rows="5"
            mb-1 mt-1
            copy-placement="outside"
          />
        </n-form-item>
      </n-gi>
    </n-grid>
  </c-card>
</template>
