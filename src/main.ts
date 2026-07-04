import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { createHead } from '@vueuse/head';
import { installAbortSignalPolyfill } from 'abort-signal-polyfill';
import { createPinia } from 'pinia';
import { registerSW } from 'virtual:pwa-register';

import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime';

import { createApp } from 'vue';
import { LoadingPlugin } from 'vue-loading-overlay';
import shadow from 'vue-shadow-dom';
import App from './App.vue';
import { i18nPlugin } from './plugins/i18n.plugin';
import { naive } from './plugins/naive.plugin';

import { plausible } from './plugins/plausible.plugin';

import router from './router';

import store from './tools/pomodoro-timer/app/store';
import '@/utils/json5-bigint';
import '@/utils/json5-bignum';

import 'virtual:uno.css';

window.addEventListener('vite:preloadError', (event: Event) => {
  console.error('Vite preload error, forcing page reload:', event);
  event.preventDefault(); // Prevent the original error from being thrown again
  window.location.reload();
});

installAbortSignalPolyfill();

library.add(fas);

registerSW();

const app = createApp(App);

const base = import.meta.env.BASE_URL ?? '/';
let toolsSettings: Record<string, Record<string, any> | any> = {};
try {
  const remoteSettingsResponse = await fetch(`${base}tools-settings.json`);
  if (remoteSettingsResponse.ok) {
    toolsSettings = (await remoteSettingsResponse.json()) as Record<string, Record<string, any> | any>;
  }
}
catch {}
app.config.globalProperties.$itToolsSettings = toolsSettings;

app.use(LoadingPlugin);
app.use(createPinia());
app.use(createHead());
app.use(i18nPlugin);
app.use(router);
app.use(naive);
app.use(plausible);
app.use(shadow);
app.use(store, 'pomodoro-store');

app.mount('#app');

hideSplashScreen();
