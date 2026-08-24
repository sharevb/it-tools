import * as _ from 'es-toolkit/compat';
import { inject } from 'vue';
import type { PlausibleInstance } from './tracker.types';

export { createTrackerService, useTracker };

function createTrackerService({ plausible }: { plausible: PlausibleInstance }) {
  return {
    trackEvent({ eventName }: { eventName: string }) {
      plausible.trackEvent(eventName);
    },
  };
}

function useTracker() {
  const plausible: PlausibleInstance | undefined = inject('plausible');

  if (_.isNil(plausible)) {
    throw new TypeError('Plausible must be instantiated');
  }

  const tracker = createTrackerService({ plausible });

  return {
    tracker,
  };
}
