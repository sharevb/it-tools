<script setup lang="ts">
import type { Themes } from 'md-editor-v3';
import { MdEditor } from 'md-editor-v3';

import 'md-editor-v3/lib/style.css';
import './md-editor-extensions';
import { useStyleStore } from '@/stores/style.store';

const theme = ref<Themes>('light');
const styleStore = useStyleStore();
watch(
  () => styleStore.isDarkTheme,
  (isDarkTheme) => (theme.value = isDarkTheme ? 'dark' : 'light'),
  { immediate: true },
);

const markdown = ref('Sample _formatted_ *text*');
</script>

<template>
  <div>
    <MdEditor v-model="markdown" :theme="theme" language="en-US" />
  </div>
</template>

<style lang="less">
// highlight.js theme for code blocks. md-editor-v3 would fetch it from a CDN, but not once it
// is given a highlight.js instance. With its default props (codeTheme 'atom', codeStyleReverse
// on the 'default' preview theme) code blocks always use the dark variant, in both app themes.
// Scoped to the editor with :where() so the rules keep their original specificity and don't
// restyle highlight.js output elsewhere in the app.
:where(.md-editor) {
  @import (less) 'highlight.js/styles/atom-one-dark.css';
}
</style>
