<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { UploadFileInfo } from 'naive-ui';
import ImageCompare from 'image-compare-viewer';
import 'image-compare-viewer/dist/image-compare-viewer.min.css';

const { t } = useI18n();

const leftUrl = ref('');
const rightUrl = ref('');
const leftImage = ref<string | null>(null);
const rightImage = ref<string | null>(null);
const viewerContainer = ref<HTMLDivElement | null>(null);
let viewerInstance = null;

function loadFromUrl() {
  leftImage.value = leftUrl.value;
  rightImage.value = rightUrl.value;
  renderViewer();
}

function handleLeftUpload({ file }: { file: UploadFileInfo }) {
  leftImage.value = URL.createObjectURL(file.file!);
  renderViewer();
}

function handleRightUpload({ file }: { file: UploadFileInfo }) {
  rightImage.value = URL.createObjectURL(file.file!);
  renderViewer();
}

function renderViewer() {
  if (!leftImage.value || !rightImage.value || !viewerContainer.value) {
    return;
  }

  viewerContainer.value.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'image-compare';
  container.innerHTML = `
    <img src="${leftImage.value}" alt="Left Image" />
    <img src="${rightImage.value}" alt="Right Image" />
  `;
  viewerContainer.value.appendChild(container);

  viewerInstance = new ImageCompare(container, {
    controlColor: '#409EFF',
    smoothing: true,
    addCircle: true,
  });
  viewerInstance.mount();
}
</script>

<template>
  <NCard :title="t('tools.image-comparer.texts.title-image-compare-viewer')" style="max-width: 800px; margin: auto;">
    <NTabs type="segment">
      <NTabPane name="url" :tab="t('tools.image-comparer.text.compare-by-url')">
        <NForm label-placement="left" label-width="150px">
          <NFormItem :label="t('tools.image-comparer.texts.label-left-image-url')">
            <NInput v-model:value="leftUrl" :placeholder="t('tools.image-comparer.texts.placeholder-enter-left-image-url')" />
          </NFormItem>
          <NFormItem :label="t('tools.image-comparer.texts.label-right-image-url')">
            <NInput v-model:value="rightUrl" :placeholder="t('tools.image-comparer.texts.placeholder-enter-right-image-url')" />
          </NFormItem>
          <n-space justify="center">
            <NButton type="primary" @click="loadFromUrl">
              {{ t('tools.image-comparer.texts.tag-compare') }}
            </NButton>
          </n-space>
        </NForm>
      </NTabPane>

      <NTabPane name="upload" :tab="t('tools.image-comparer.text.compare-by-upload')">
        <NForm label-placement="left">
          <n-space justify="space-evenly">
            <NFormItem :label="t('tools.image-comparer.texts.label-upload-left-image')">
              <NUpload :default-upload="false" accept="image/*" @change="handleLeftUpload">
                <NButton>{{ t('tools.image-comparer.texts.tag-upload-left') }}</NButton>
              </NUpload>
            </NFormItem>
            <NFormItem :label="t('tools.image-comparer.texts.label-upload-right-image')">
              <NUpload :default-upload="false" accept="image/*" @change="handleRightUpload">
                <NButton>{{ t('tools.image-comparer.texts.tag-upload-right') }}</NButton>
              </NUpload>
            </NFormItem>
          </n-space>
        </NForm>
      </NTabPane>
    </NTabs>

    <div ref="viewerContainer" mt-1 />
  </NCard>
</template>

<style scoped>
.image-compare {
  width: 100%;
  max-width: 700px;
  margin: auto;
}
.image-compare img {
  width: 100%;
  object-fit: contain;
}
</style>
