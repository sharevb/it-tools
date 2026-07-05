<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { UploadFileInfo } from 'naive-ui';
import JSZip from 'jszip';
import { Transform, decodeImage, encodeIcoImages } from 'image-in-browser';

const { t } = useI18n();

const sizes = [16, 32, 48, 64, 180, 192, 512];
const appleSizes = [180, 192, 512];

async function generateIcon(file: File) {
  const fileBuffer = new Uint8Array(await file.arrayBuffer());

  const decodedImage = decodeImage({
    data: fileBuffer,
  });

  if (decodedImage == null) {
    throw new Error(t('tools.favicon-generator.texts.invalid-png-file'));
  };

  return encodeIcoImages({
    images: [16, 32, 64, 128, 256].map(size => Transform.copyResize({
      image: decodedImage,
      width: size,
      maintainAspect: true,
    })),
  });
}

const previews = ref<Array<{ size: number; dataUrl: string }>>([]);
const headTags = ref('');
const zipBlob = ref<Blob | null>(null);
const canDownload = ref(false);

function handleUpload({ file }: { file: UploadFileInfo }) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      generateAssets(img, file.file!);
    };
    img.src = reader.result as string;
  };
  reader.readAsDataURL(file.file!);
}

async function generateAssets(img: HTMLImageElement, file: File) {
  const zip = new JSZip();
  const tags = [];
  previews.value = [];

  for (const size of sizes) {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, size, size);
    const dataUrl = canvas.toDataURL('image/png');
    const blob = await (await fetch(dataUrl)).blob();
    const filename = `favicon-${size}x${size}.png`;
    zip.file(filename, blob);

    previews.value.push({ size, dataUrl });
    tags.push(`<link rel="icon" type="image/png" sizes="${size}x${size}" href="${filename}">`);
  }

  for (const size of appleSizes) {
    tags.push(`<link rel="apple-touch-icon" sizes="${size}x${size}" href="favicon-${size}x${size}.png">`);
  }

  tags.push('<link rel="manifest" href="site.webmanifest">');

  zip.file('site.webmanifest', JSON.stringify({
    name: '',
    short_name: '',
    icons: sizes.map(size => ({
      src: `favicon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
    })),
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
  }, null, 2));

  zip.file('favicon.ico', await generateIcon(file));

  zip.file('head-tags.html', tags.join('\n'));
  headTags.value = tags.join('\n');

  zip.generateAsync({ type: 'blob' }).then((blob) => {
    zipBlob.value = blob;
    canDownload.value = true;
  });
}

function downloadURL(data: string, fileName: string) {
  const a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = 'none';
  a.click();
  a.remove();
}

function downloadZip() {
  if (zipBlob.value) {
    downloadURL(window.URL.createObjectURL(zipBlob.value), 'favicons.zip');
  }
}
</script>

<template>
  <NCard :title="t('tools.favicon-generator.texts.title-favicon-pack-generator')" style="max-width: 700px; margin: auto;">
    <n-space justify="center">
      <NUpload
        :show-file-list="false"
        accept="image/png"
        :custom-request="handleUpload"
      >
        <NButton type="primary">
          {{ t('tools.favicon-generator.texts.tag-upload-png-image') }}
        </NButton>
      </NUpload>
    </n-space>

    <n-card v-if="previews.length" :title="t('tools.favicon-generator.texts.title-️-previews')" mt-2>
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <div v-for="icon in previews" :key="icon.size" style="text-align: center;">
          <img :src="icon.dataUrl" :alt="`Favicon ${icon.size}`" :width="icon.size" :height="icon.size">
          <p>{{ icon.size }}×{{ icon.size }}</p>
        </div>
      </div>
    </n-card>

    <n-card v-if="headTags" :title="t('tools.favicon-generator.texts.title-html-head-tags')" mt-2>
      <textarea-copyable :value="headTags" language="html" />
    </n-card>

    <n-space justify="center" mt-2>
      <NButton v-if="canDownload" type="success" @click="downloadZip">
        {{ t('tools.favicon-generator.texts.tag-download-zip') }}
      </NButton>
    </n-space>
  </NCard>
</template>
