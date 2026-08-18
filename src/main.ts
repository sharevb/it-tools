import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import { LoadingPlugin } from 'vue-loading-overlay';

import { installAbortSignalPolyfill } from 'abort-signal-polyfill';

import shadow from 'vue-shadow-dom';
import { plausible } from './plugins/plausible.plugin';
import { appBaseUrl } from '@/utils/base-url';
import '@/utils/json5-bigint';
import '@/utils/json5-bignum';

import Vue3Katex from 'vue3-katex';
import 'katex/dist/katex.min.css';

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

// Not `registerSW()` from virtual:pwa-register: that one bakes the build-time base into
// the script URL, which is a relative `./sw.js` here and would resolve against the current
// route rather than the app root. The runtime base is known, so register against it
// directly -- the generated service worker is base-agnostic (its precache entries are
// relative to its own URL) and takes care of updating itself, see `registerType:
// 'autoUpdate'` in vite.config.ts.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const registerServiceWorker = () => {
    navigator.serviceWorker
      .register(`${appBaseUrl}sw.js`, { scope: appBaseUrl })
      .catch((error) => console.error('Service worker registration failed:', error));
  };

  // Registering competes with the page's own loading, so it waits for `load` -- but this
  // module sits behind top-level awaits (the config fetches in tools-settings.ts and
  // tools/index.ts), so `load` has usually fired long before we get here and waiting for
  // it again would mean never registering at all.
  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker, { once: true });
  }
}

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
app.use(Vue3Katex);

app.mount('#app');
