<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { FFmpeg } from '@ffmpeg/ffmpeg';

import ffmpegClassWorkerUrl from '@ffmpeg/ffmpeg/worker?worker&url';

import { toBlobURL } from '@ffmpeg/util';

const { t } = useI18n();

const logs = ref<string[]>([]);

const ffmpeg = new FFmpeg();
ffmpeg.on('log', ({ message }) => {
  logs.value.push(message);
});

const loading = ref(false);
const error = ref('');
const loop = ref('5');

async function loadFFmpeg() {
  if (!ffmpeg.loaded) {
    const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      classWorkerURL: ffmpegClassWorkerUrl,
    });
  }
}

async function onFileUploaded(gifFile: File) {
  loading.value = true;
  error.value = '';

  try {
    await loadFFmpeg();

    const inputName = 'input.gif';
    const outputName = 'output.mp4';

    const buffer = new Uint8Array(await gifFile.arrayBuffer());
    if (!buffer) {
      return;
    }
    ffmpeg.writeFile(inputName, buffer);

    await ffmpeg.exec([
      '-stream_loop', loop.value,
      '-i', inputName,
      '-movflags', 'faststart',
      '-pix_fmt', 'yuv420p',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      outputName,
    ]);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${gifFile.name.replace(/\.gif$/, '')}.mp4`;
    a.click();

    URL.revokeObjectURL(url);
  }
  catch (err: any) {
    error.value = err.toString();
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <n-space justify="center" mb-1>
      <n-form-item :label="t('tools.gif-to-mp4.texts.label-stream-loop')" label-placement="left">
        <n-input-number-i18n v-model:value="loop" :min="1" />
      </n-form-item>
    </n-space>

    <div style="flex: 0 0 100%">
      <div mx-auto max-w-600px>
        <c-file-upload
          :title="t('tools.gif-to-mp4.texts.title-drag-and-drop-gif-here-or-click-to-select-a-file')"
          accept=".gif"
          @file-upload="onFileUploaded"
        />
      </div>
    </div>

    <div mt-3 flex justify-center>
      <c-alert v-if="error" type="error">
        {{ error }}
      </c-alert>
      <n-spin
        v-if="loading"
        size="small"
      />
    </div>

    <c-card :title="t('tools.gif-to-mp4.texts.title-logs')">
      <pre>{{ logs.join('\n') }}</pre>
    </c-card>
  </div>
</template>
