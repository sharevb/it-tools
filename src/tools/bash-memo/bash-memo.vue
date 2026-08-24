<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useThemeVars } from 'naive-ui';
import type { Component } from 'vue';

const themeVars = useThemeVars();
const { locale } = useI18n();

const memoImports = import.meta.glob('./bash-memo.content*.md');
const memoComponent = ref<Component | null>(null);

async function loadMemo(currentLocale = locale.value) {
  const memoKey = `./bash-memo.content.${currentLocale}.md`;
  const loader = memoImports[memoKey] ?? memoImports['./bash-memo.content.md'];

  if (!loader) {
    memoComponent.value = null;
    return;
  }

  const module = (await loader()) as { default?: Component };
  memoComponent.value = module.default ?? module;
}

watch(
  locale,
  () => {
    loadMemo();
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <component v-if="memoComponent" :is="memoComponent" />
  </div>
</template>

<style lang="less" scoped>
::v-deep(pre) {
  margin: 0;
  padding: 15px 22px;
  background-color: v-bind('themeVars.cardColor');
  border-radius: 4px;
  overflow: auto;
}
</style>
