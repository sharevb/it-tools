<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { NGlobalStyle, NMessageProvider, NNotificationProvider, darkTheme } from 'naive-ui';
import { darkThemeOverrides, lightThemeOverrides } from './themes';
import { layouts } from './layouts';
import { useStyleStore } from './stores/style.store';
import { useAppTheme } from './ui/theme/themes';

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

// Apply CSS variables to the document root
watchEffect(() => {
  const root = document.documentElement;
  Object.entries(cssVars.value).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
});

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
        <div>
          <component :is="layout">
            <RouterView />
          </component>
        </div>
      </NNotificationProvider>
    </NMessageProvider>
  </n-config-provider>
</template>

<style>
body {
  min-height: 100%;
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

body .vld-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--loading-background-color);
  z-index: 9999;
  text-align: center;
}

body .vld-container .vl-overlay.vl-active {
  margin-top: 15%;
}
</style>
