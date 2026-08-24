<script setup lang="ts">
import { useTheme } from '../ui/c-link/c-link.theme';
import { appBaseUrl as base } from '@/utils/base-url';

// Async: keeps markdown-it out of the startup bundle; the renderer only loads on
// deployments that actually ship a home.custom.md.
const VueMarkdown = defineAsyncComponent(() => import('vue-markdown-render'));

const linkTheme = useTheme();

const homeCustomMarkdown = ref('');

const res = await fetch(`${base}home.custom.md`);
if (res.ok) {
  homeCustomMarkdown.value = await res.text();
}
</script>

<template>
  <div v-if="homeCustomMarkdown" class="home-custom-md">
    <VueMarkdown :source="homeCustomMarkdown" />
  </div>
</template>

<style scoped lang="less">
::v-deep(.home-custom-md) a {
  line-height: inherit;
  font-family: inherit;
  font-size: inherit;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-weight: 400;
  color: v-bind('linkTheme.default.textColor');
  border-radius: 4px;
  transition: color cubic-bezier(0.4, 0, 0.2, 1) 0.3s;

  outline-offset: 1px;

  &:hover {
    color: v-bind('linkTheme.default.hover.textColor');
  }

  &:active {
    color: v-bind('linkTheme.default.textColor');
  }

  &:focus {
    color: v-bind('linkTheme.default.outline.color');
  }
}
</style>
