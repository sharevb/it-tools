import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { LoadingPlugin } from 'vue-loading-overlay';

import { registerSW } from 'virtual:pwa-register';
import shadow from 'vue-shadow-dom';
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime';
import { plausible } from './plugins/plausible.plugin';
import '@/utils/json5-bigint';

import 'virtual:uno.css';

import { naive } from './plugins/naive.plugin';

import App from './App.vue';
import router from './router';
import { i18nPlugin } from './plugins/i18n.plugin';

import store from './tools/pomodoro-timer/app/store';

window.addEventListener('vite:preloadError', (event: Event) => {
  console.error('Vite preload error, forcing page reload:', event);
  event.preventDefault(); // Prevent the original error from being thrown again
  window.location.reload();
});

// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return JSON.rawJSON ? JSON.rawJSON(this.toString()) : this.toString();
};

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
