<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const pxRemRatio = 16;

const pxInput = ref(16);
const remOutput = computed(() => (pxInput.value / pxRemRatio).toFixed(3));

const remInput = ref(1);
const pxOutput = computed(() => (remInput.value * pxRemRatio).toFixed(3));
</script>

<template>
  <c-card :title="t('tools.rem-px-converter.texts.title-px-to-rem')">
    <n-form-item :label="t('tools.rem-px-converter.texts.label-pixel-value-px')" label-placement="left">
      <n-input-number v-model:value="pxInput" />
    </n-form-item>

    <input-copyable :label="t('tools.rem-px-converter.texts.label-corresponding-rem-value')" label-position="left" :value="remOutput" />
  </c-card>

  <c-card :title="t('tools.rem-px-converter.texts.title-rem-to-px')">
    <n-form-item :label="t('tools.rem-px-converter.texts.label-rem-value-rem')" label-placement="left">
      <n-input-number v-model:value="remInput" />
    </n-form-item>

    <input-copyable :label="t('tools.rem-px-converter.texts.label-corresponding-px-value')" label-position="left" :value="pxOutput" />
  </c-card>
</template>
