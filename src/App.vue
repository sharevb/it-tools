<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { NGlobalStyle, NMessageProvider, NNotificationProvider, darkTheme } from 'naive-ui';
import { get } from '@vueuse/core';
import { darkThemeOverrides, lightThemeOverrides } from './themes';
import { layouts } from './layouts';
import { useStyleStore } from './stores/style.store';
import { useAppTheme } from './ui/theme/themes';
import { getITToolsSetting } from './composable/queryParams';

const route = useRoute();
const layout = computed(() => route?.meta?.layout ?? layouts.base);
const styleStore = useStyleStore();

const theme = computed(() => (styleStore.isDarkTheme ? darkTheme : null));
const themeOverrides = computed(() => (styleStore.isDarkTheme ? darkThemeOverrides : lightThemeOverrides));

const { locale } = useI18n();

const colorPalette = useAppTheme();

// Create CSS custom properties for the color palette
const cssVars = computed(() => ({
  '--loading-background-color': colorPalette.value.loading_background,
}));

// Apply CSS variables to the document root - batch updates to avoid thrashing
let pendingCssUpdate = false;
watchEffect(() => {
  if (pendingCssUpdate) {
    return;
  }

  pendingCssUpdate = true;
  requestAnimationFrame(() => {
    const root = document.documentElement;
    Object.entries(cssVars.value).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    pendingCssUpdate = false;
  });
});

locale.value = get(getITToolsSetting('default_locale', locale.value));

syncRef(
  locale,
  useStorage('locale', locale),
);
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <NGlobalStyle />
    <NMessageProvider placement="bottom">
      <NNotificationProvider placement="bottom-right">
        <div class="app-root">
          <component :is="layout">
            <RouterView />
          </component>
        </div>
      </NNotificationProvider>
    </NMessageProvider>
  </n-config-provider>
</template>

<style>
html {
  height: 100%;
  margin: 0;
  padding: 0;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  -webkit-backface-visibility: hidden;
}

body {
  min-height: 100%;
  margin: 0;
  padding: 0;
  /* The document scrolls vertically (see MenuLayout.vue); never horizontally */
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

* {
  box-sizing: border-box;
}

/* No transform/contain here: they would make .app-root the containing block
   for position:fixed descendants (the mobile menu), and the old inner-scroll
   perf rationale no longer applies now that the document is the scroller. */
.app-root {
  -webkit-overflow-scrolling: touch;
}

body .vld-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background-color: var(--loading-background-color);
  text-align: center;
  pointer-events: none;
}

/* Fullscreen fallback: overlay mounted on <body> (first navigation) */
body > .vld-container {
  height: 100vh;
  z-index: 9999;
}

/* Route-change overlay scoped to the page area (see router.ts) */
.page-content > .vld-container {
  height: 100%;
  min-height: 350px;
  z-index: 100;
}

body .vld-container.vl-active {
  pointer-events: auto;
}

body .vld-container .vl-overlay.vl-active {
  margin-top: 15%;
}
</style>
