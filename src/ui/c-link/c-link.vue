<script lang="ts" setup>
import { type RouteLocationRaw } from 'vue-router';
import { useTheme } from './c-link.theme';

const props = defineProps<{
  href?: string;
  to?: RouteLocationRaw;
  target?: string;
}>();

const { href, to, target } = toRefs(props);

const theme = useTheme();
</script>

<template>
  <a v-if="href" :href="href" class="c-link" :target="target">
    <slot />
  </a>
  <router-link v-else-if="to" :to="to" class="c-link" :target="target">
    <slot />
  </router-link>
  <span v-else class="c-link">
    <slot />
  </span>
</template>

<style lang="less" scoped>
.c-link {
  line-height: inherit;
  font-family: inherit;
  font-size: inherit;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-weight: 400;
  color: v-bind('theme.default.textColor');
  border-radius: 4px;
  transition: color cubic-bezier(0.4, 0, 0.2, 1) 0.3s;

  outline-offset: 1px;

  @media (hover: hover) {
    &:hover {
      color: v-bind('theme.default.hover.textColor');
    }
  }

  &:active {
    color: v-bind('theme.default.textColor');
  }

  &:focus {
    color: v-bind('theme.default.outline.color');
  }
}
</style>
