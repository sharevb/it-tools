import { useColorMode, useMediaQuery, usePreferredDark } from '@vueuse/core';
import { defineStore } from 'pinia';
import { type Ref, computed, watch } from 'vue';
import { useITStorage } from '@/composable/queryParams';
import { darkThemeOverrides, lightThemeOverrides } from '@/themes';

export const useStyleStore = defineStore('style', {
  state: () => {
    // Same storage key + values ('auto' | 'light' | 'dark') as VueUse useDark,
    // which the pre-paint script in index.html reads before Vue mounts.
    const themeMode = useColorMode({ emitAuto: true });
    const prefersDark = usePreferredDark();
    const isDarkTheme = computed(() => (themeMode.value === 'auto' ? prefersDark.value : themeMode.value === 'dark'));
    const toggleDark = () => {
      themeMode.value = isDarkTheme.value ? 'light' : 'dark';
    };
    const isSmallScreen = useMediaQuery('(max-width: 700px)');
    const isMenuCollapsed = useITStorage('isMenuCollapsed', isSmallScreen.value) as Ref<boolean>;

    watch(isSmallScreen, v => (isMenuCollapsed.value = v));

    // Keep browser UI (iOS Safari chrome, PWA title bar) matching the app background
    watch(isDarkTheme, (isDark) => {
      // Cast: naive-ui's Layout override type resolves to '{}' under
      // tsconfig.vitest.json, even though the value is a plain color string
      const themeColor = (isDark ? darkThemeOverrides.Layout?.color : lightThemeOverrides.Layout?.color) as string | undefined;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor ?? (isDark ? '#1c1c1c' : '#f1f5f9'));
    }, { immediate: true });

    return {
      themeMode,
      isDarkTheme,
      toggleDark,
      isMenuCollapsed,
      isSmallScreen,
    };
  },
});
