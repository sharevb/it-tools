<script setup lang="ts">
import { Buffer } from 'node:buffer';
import { useI18n } from 'vue-i18n';
import type { Ref } from 'vue';
import potrace from 'potrace';
import { Base64 } from 'js-base64';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

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

const posterize = ref(true);
const fileInput = ref() as Ref<File>;
const svg = computedAsync(async () => {
  const trace = !posterize.value;
  const file = fileInput.value;
  if (!file) {
    return '';
  }
  try {
    const buffer = await file2Buffer(file);
    return (trace ? await traceAsync(buffer) : await posterizeAsync(buffer));
  }
  catch (e: any) {
    return e.toString();
  }
});

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

    <div style="text-align: center;">
      <n-checkbox v-model:checked="posterize" mt-2>
        {{ t('tools.potrace.texts.tag-posterize') }}
      </n-checkbox>
    </div>

    <n-divider />

    <div>
      <h3>{{ t('tools.potrace.texts.tag-potrace-result') }}</h3>
      <TextareaCopyable
        :value="svg"
        word-wrap
      />

      <n-divider />

      <div style="text-align: center;">
        <img width="150" :src="svgBase64" style="background-color: white">
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
