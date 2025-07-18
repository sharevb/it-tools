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

// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return JSON.rawJSON ? JSON.rawJSON(this.toString()) : this.toString();
};

library.add(fas);

registerSW();

const app = createApp(App);

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
