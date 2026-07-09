import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { LoadingPlugin } from 'vue-loading-overlay';

import { installAbortSignalPolyfill } from 'abort-signal-polyfill';

import { registerSW } from 'virtual:pwa-register';
import shadow from 'vue-shadow-dom';
import { plausible } from './plugins/plausible.plugin';
import '@/utils/json5-bigint';
import '@/utils/json5-bignum';

import 'virtual:uno.css';

import { naive } from './plugins/naive.plugin';

import App from './App.vue';
import router from './router';
import { i18nPlugin } from './plugins/i18n.plugin';
import { toolsSettings } from './tools-settings';

import store from './tools/pomodoro-timer/app/store';

window.addEventListener('vite:preloadError', (event: Event) => {
  console.error('Vite preload error, forcing page reload:', event);
  event.preventDefault(); // Prevent the original error from being thrown again
  // Deferred: Firefox also fires this event for preloads cancelled by a user
  // navigation, and an immediate reload would race (and abort) that navigation.
  // If the page is really navigating away, its timers die with it and no reload
  // happens; on a genuine chunk-load failure the reload still runs.
  setTimeout(() => window.location.reload(), 100);
});

installAbortSignalPolyfill();

registerSW();

const app = createApp(App);

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
