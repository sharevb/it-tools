<script setup lang="ts">
import type { Component } from 'vue';
import { NIcon, useThemeVars } from 'naive-ui';
import IconBrandGithub from '~icons/tabler/brand-github';
import IconCheck from '~icons/tabler/check';
import IconDeviceDesktop from '~icons/tabler/device-desktop';
import IconInfoCircle from '~icons/tabler/info-circle';
import IconLanguage from '~icons/tabler/language';
import IconMoon from '~icons/tabler/moon';
import IconSun from '~icons/tabler/sun';
import { appLocales } from '@/plugins/i18n.plugin';
import { useStyleStore } from '@/stores/style.store';

const styleStore = useStyleStore();
const { isDarkTheme, themeMode } = toRefs(styleStore);
const themeVars = useThemeVars();

const { locale, t } = useI18n();

const localesLong: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  da: 'Dansk',
  es: 'Español',
  fr: 'Français',
  ga: 'Gaeilge',
  it: 'Italiano',
  nl: 'Nederlands',
  no: 'Norwegian',
  pl: 'Polski',
  pt: 'Português',
  ru: 'Русский',
  tr: 'Türkçe',
  el: 'ελληνικά',
  uk: 'Українська',
  ko: '한국인',
  zh: '中文',
  vi: 'Tiếng Việt',
  ar: 'عربي',
  hi: 'हिन्दी',
};

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

function optionLabel(text: string, isActive: boolean) {
  return () => h('span', { style: isActive ? { color: themeVars.value.primaryColor } : {} }, text);
}

const languageOptions = computed(() =>
  appLocales.map((availableLocale) => ({
    key: availableLocale,
    label: optionLabel(localesLong[availableLocale] ?? availableLocale, availableLocale === locale.value),
    icon: availableLocale === locale.value ? renderIcon(IconCheck) : undefined,
  })),
);

function onLanguageSelect(key: string) {
  locale.value = key;
}

const themeOptions = computed(() => [
  {
    key: 'auto',
    label: optionLabel(t('home.nav.themeSystem', 'System'), themeMode.value === 'auto'),
    icon: renderIcon(IconDeviceDesktop),
  },
  {
    key: 'light',
    label: optionLabel(t('home.nav.themeLight', 'Light'), themeMode.value === 'light'),
    icon: renderIcon(IconSun),
  },
  {
    key: 'dark',
    label: optionLabel(t('home.nav.themeDark', 'Dark'), themeMode.value === 'dark'),
    icon: renderIcon(IconMoon),
  },
]);

const themeTriggerIcon = computed(() => (isDarkTheme.value ? IconMoon : IconSun));

function onThemeSelect(key: 'auto' | 'light' | 'dark') {
  styleStore.themeMode = key;
}

// The mobile menu closes on navigation (MenuLayout watches the route), but
// clicking About while already on /about doesn't navigate — close explicitly.
function closeMenuOnSmallScreen() {
  if (styleStore.isSmallScreen) {
    styleStore.isMenuCollapsed = true;
  }
}
</script>

<template>
  <c-tooltip :tooltip="$t('home.nav.github')" position="bottom">
    <c-button
      circle
      variant="text"
      href="https://github.com/sharevb/it-tools"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="$t('home.nav.githubRepository')"
    >
      <n-icon size="25" :component="IconBrandGithub" />
    </c-button>
  </c-tooltip>

  <c-tooltip :tooltip="$t('home.nav.about')" position="bottom">
    <c-button circle variant="text" to="/about" :aria-label="$t('home.nav.aboutLabel')" @click="closeMenuOnSmallScreen">
      <n-icon size="25" :component="IconInfoCircle" />
    </c-button>
  </c-tooltip>

  <n-dropdown :options="themeOptions" trigger="click" @select="onThemeSelect">
    <c-button circle variant="text" :aria-label="t('home.nav.mode')">
      <n-icon size="25" :component="themeTriggerIcon" />
    </c-button>
  </n-dropdown>

  <n-dropdown :options="languageOptions" trigger="click" @select="onLanguageSelect">
    <c-button circle variant="text" :aria-label="t('home.nav.language', 'Language')">
      <n-icon size="25" :component="IconLanguage" />
    </c-button>
  </n-dropdown>
</template>

<style lang="less" scoped>
.n-button {
  &:not(:last-child) {
    margin-right: 5px;
  }
}
</style>
