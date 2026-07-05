<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{ font: { weight: string; style: string; fallback: string } }>();

const { t } = useI18n();

const weightOptions = [
  { label: t('tools.font-compare.texts.label-normal'), value: 'normal' },
  { label: t('tools.font-compare.texts.label-bold'), value: 'bold' },
  { label: t('tools.font-compare.texts.label-lighter'), value: 'lighter' },
  { label: t('tools.font-compare.texts.label-100'), value: '100' },
  { label: t('tools.font-compare.texts.label-400'), value: '400' },
  { label: t('tools.font-compare.texts.label-700'), value: '700' },
];

const styleOptions = [
  { label: t('tools.font-compare.texts.label-normal'), value: 'normal' },
  { label: t('tools.font-compare.texts.label-italic'), value: 'italic' },
  { label: t('tools.font-compare.texts.label-oblique'), value: 'oblique' },
];

const fallbackOptions = [
  { label: t('tools.font-compare.texts.label-sans-serif'), value: 'sans-serif' },
  { label: t('tools.font-compare.texts.label-serif'), value: 'serif' },
  { label: t('tools.font-compare.texts.label-monospace'), value: 'monospace' },
  { label: t('tools.font-compare.texts.label-cursive'), value: 'cursive' },
  { label: t('tools.font-compare.texts.label-fantasy'), value: 'fantasy' },
];
</script>

<!-- eslint-disable vue/no-mutating-props -->
<template>
  <n-space vertical>
    <c-select
      v-model:value="font.weight"
      :label="t('tools.font-compare.texts.label-weight')"
      label-position="left"
      label-width="100px"
      :options="weightOptions"
      :placeholder="t('tools.font-compare.texts.placeholder-font-weight')"
    />
    <c-select
      v-model:value="font.style"
      :label="t('tools.font-compare.texts.label-style')"
      label-position="left"
      label-width="100px"
      :options="styleOptions"
      :placeholder="t('tools.font-compare.texts.placeholder-font-style')"
    />
    <c-select
      v-model:value="font.fallback"
      :label="t('tools.font-compare.texts.label-fallback')"
      label-width="100px"
      label-position="left"
      :options="fallbackOptions"
      :placeholder="t('tools.font-compare.texts.placeholder-fallback-font')"
    />
  </n-space>
</template>
