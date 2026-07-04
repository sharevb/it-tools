import type { App } from 'vue';

import { init, track } from '@plausible-analytics/tracker';
import { config } from '@/config';

const trackerApi = {
  trackEvent: (eventName: string) => track(eventName, {}),
};

const noopTrackerApi = {
  trackEvent: (_eventName: string) => {},
};

export const plausible = {
  install: (app: App) => {
    const { isTrackerEnabled, domain, apiHost, trackLocalhost } = config.plausible;

    if (isTrackerEnabled) {
      init({
        domain,
        endpoint: apiHost ? `${apiHost}/api/event` : undefined,
        captureOnLocalhost: trackLocalhost,
        autoCapturePageviews: true,
      });
      app.provide('plausible', trackerApi);
    }
    else {
      app.provide('plausible', noopTrackerApi);
    }
  },
};
