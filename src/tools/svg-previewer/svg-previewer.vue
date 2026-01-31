<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const svgContent = ref<string | null>(null);
const backgroundColor = ref<string>('#ffffff');

const { t } = useI18n();

function readAsTextAsync(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result?.toString() ?? '');
    reader.onerror = error => reject(error);
  });
}

async function onFileUploaded(uploadedFile: File) {
  svgContent.value = await readAsTextAsync(uploadedFile);
}
</script>

<template>
  <div style="padding: 16px;">
    <c-file-upload
      :title="t('tools.svg-previewer.texts.title-upload-a-svg-file')"
      paste-image
      accept=".svg"
      mb-1
      @file-upload="onFileUploaded"
    />

    <c-input-text
      v-model:value="svgContent"
      :title="t('tools.svg-previewer.texts.title-raw-svg-content')"
      rows="6"
      multiline
      :placeholder="t('tools.svg-previewer.texts.placeholder-paste-raw-svg-content-here')"
      mb-1
    />

    <n-form-item :label="t('tools.svg-previewer.texts.label-select-background')" label-placement="left" mb-1>
      <NColorPicker v-model:value="backgroundColor" />
    </n-form-item>

    <NCard
      :title="t('tools.svg-previewer.texts.title-svg-preview')"
      style="margin-top: 16px; min-height: 300px;"
    >
      <div
        v-if="svgContent"
        :style="{
          backgroundColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          overflow: 'auto',
        }"
        v-html="svgContent"
      />
      <NEmpty v-else description="No SVG loaded yet" />
    </NCard>
  </div>
</template>
