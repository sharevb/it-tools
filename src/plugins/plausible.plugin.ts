import { noop } from 'es-toolkit/compat';

import { init, track } from '@plausible-analytics/tracker';
import type { App } from 'vue';
import type { PlausibleInstance } from '@/modules/tracker/tracker.types';
import { config } from '@/config';

function createFakePlausibleInstance(): PlausibleInstance {
  return {
    trackEvent: noop,
    enableAutoPageviews: noop,
  };
}

let isTrackerInitialized = false;

export function createPlausibleInstance({
  config,
}: {
  config: {
    isTrackerEnabled: boolean
    domain: string
    apiHost: string
    trackLocalhost: boolean
  }
}): PlausibleInstance {
  // `init` throws when no domain is configured. Without a domain the events would be attributed to
  // nothing anyway, so stay with the no-op instance instead.
  if (!config.isTrackerEnabled || !config.domain) {
    return createFakePlausibleInstance();
  }

  // `init` also throws when called twice, which would take the whole app down as soon as the plugin
  // is installed on a second app instance (tests, hot reload). The tracker is already running at
  // that point, so reuse it rather than initializing it again.
  if (!isTrackerInitialized) {
    init({
      domain: config.domain,
      // the previous tracker took an api host and appended the path itself; keep the very same
      // endpoint, including the relative one used when no api host is configured
      endpoint: `${config.apiHost.replace(/\/$/, '')}/api/event`,
      captureOnLocalhost: config.trackLocalhost,
    });

    isTrackerInitialized = true;
  }

  return {
    trackEvent: eventName => track(eventName, {}),
    // `init` already captures pageviews, `autoCapturePageviews` being enabled by default
    enableAutoPageviews: noop,
  };
}

export const plausible = {
  install: (app: App) => {
    const plausible = createPlausibleInstance({ config: config.plausible });
    plausible.enableAutoPageviews();

    app.provide('plausible', plausible);
  },
};
