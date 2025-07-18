<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Ref } from 'vue';
import { type CSSType, imageToCSS } from './image-to-css.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const typeOptions = [
  { label: t('tools.image-to-css.texts.label-background'), value: 'Background' },
  { label: t('tools.image-to-css.texts.label-border'), value: 'Border' },
  { label: t('tools.image-to-css.texts.label-listitem-bullet'), value: 'ListItemBullet' },
  { label: t('tools.image-to-css.texts.label-css-data-url'), value: 'Url' },
];

const inputType = ref<'file' | 'content'>('file');
const type = ref('Background');
const svgContent = ref('');
const fileInput = ref() as Ref<File | null>;
const cssCode = computedAsync(async () => {
  try {
    if (inputType.value === 'file' && fileInput.value) {
      return (await imageToCSS(fileInput.value, type.value as CSSType));
    }
    else {
      return (await imageToCSS(svgContent.value, type.value as CSSType));
    }
  }
  catch (e: any) {
    return e.toString();
  }
});

async function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}

watch(svgContent, (_, newValue) => {
  if (newValue !== '') {
    fileInput.value = null;
  }
});
</script>

<template>
  <div>
    <n-radio-group v-model:value="inputType" name="radiogroup" mb-2 flex justify-center>
      <n-space>
        <n-radio
          value="file"
          :label="t('tools.image-to-css.texts.label-file')"
        />
        <n-radio
          value="content"
          :label="t('tools.image-to-css.texts.label-content')"
        />
      </n-space>
    </n-radio-group>

    <c-file-upload
      v-if="inputType === 'file'"
      :title="t('tools.image-to-css.texts.title-drag-and-drop-an-image-here-or-click-to-select-a-file')"
      paste-image
      @file-upload="onUpload"
    />

    <c-input-text
      v-if="inputType === 'content'"
      v-model:value="svgContent"
      multiline
      rows="5"
      :label="t('tools.image-to-css.texts.label-svg-content')"
      :placeholder="t('tools.image-to-css.texts.placeholder-paste-your-svg-content-here')"
      mb-2
    />

    <n-divider />

    <c-select
      v-model:value="type"
      label-position="top"
      :label="t('tools.image-to-css.texts.label-css-type')"
      :options="typeOptions"
      :placeholder="t('tools.image-to-css.texts.placeholder-select-css-type')"
    />

    <div v-if="cssCode !== ''">
      <n-divider />

      <h3>{{ t('tools.image-to-css.texts.tag-css-code') }}</h3>
      <TextareaCopyable
        :value="cssCode"
        word-wrap
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
