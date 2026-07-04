<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import { useITStorage, useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const gradientType = useQueryParamOrStorage({ name: 'type', storageName: 'css-gradients:t', defaultValue: 'linear' });
const angle = useQueryParamOrStorage({ name: 'angle', storageName: 'css-gradients:a', defaultValue: 90 });

const colorStops = useITStorage('css-gradients:s', [
  { color: '#ff0000', position: 0 },
  { color: '#0000ff', position: 100 },
]);

const gradientCSS = computed(() => {
  const stops = _.orderBy(colorStops.value, 'position')
    .map(({ color, position }) => `${color} ${position}%`)
    .join(', ');
  return gradientType.value === 'linear'
    ? `linear-gradient(${angle.value}deg, ${stops})`
    : `radial-gradient(${stops})`;
});

function addStop() {
  colorStops.value.push({ color: '#ffffff', position: 50 });
}

function removeStop(index: number) {
  colorStops.value.splice(index, 1);
}
</script>

<template>
  <div>
    <NForm label-placement="left">
      <n-space justify="center">
        <NFormItem :label="t('tools.css-gradient-generator.texts.label-gradient-type')">
          <NRadioGroup v-model:value="gradientType">
            <NRadioButton value="linear">
              {{ t('tools.css-gradient-generator.texts.tag-linear') }}
            </NRadioButton>
            <NRadioButton value="radial">
              {{ t('tools.css-gradient-generator.texts.tag-radial') }}
            </NRadioButton>
          </NRadioGroup>
        </NFormItem>

        <NFormItem v-if="gradientType === 'linear'" :label="t('tools.css-gradient-generator.texts.label-angle-degrees')">
          <NSlider v-model:value="angle" :min="0" :max="360" :step="1" mr-1 />
          <n-input-number :value="angle" />
        </NFormItem>
      </n-space>

      <c-card :title="t('tools.css-gradient-generator.texts.title-color-stops')">
        <div class="color-stop-list" w-full>
          <div
            v-for="(stop, index) in colorStops"
            :key="index"
            class="color-stop-item"
          >
            <NColorPicker v-model:value="stop.color" />
            <NInputNumber
              v-model:value="stop.position"
              :min="0"
              :max="100"
              :step="1"
              style="width: 150px"
            />
            <NButton size="small" type="error" @click="removeStop(index)">
              {{ t('tools.css-gradient-generator.texts.tag-remove') }}
            </NButton>
          </div>
        </div>
        <n-space justify="center">
          <NButton type="primary" size="small" @click="addStop">
            {{ t('tools.css-gradient-generator.texts.tag-add-color-stop') }}
          </NButton>
        </n-space>
      </c-card>

      <c-card :title="t('tools.css-gradient-generator.texts.title-preview')" mt-1>
        <div class="preview" :style="{ background: gradientCSS }" />
      </c-card>

      <c-card :title="t('tools.css-gradient-generator.texts.title-generated-css')" mt-1>
        <textarea-copyable :value="gradientCSS" language="css" />
      </c-card>
    </NForm>
  </div>
</template>

<style scoped>
.color-stop-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 8px;
}
.color-stop-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.preview {
  height: 150px;
  border-radius: 8px;
  margin: 16px 0;
  border: 1px solid #ccc;
}
</style>
