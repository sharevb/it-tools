import * as _ from 'es-toolkit/compat';
import { inject } from 'vue';

export { createTrackerService, useTracker };

interface TrackerApi { trackEvent: (eventName: string) => void }

function createTrackerService({ plausible }: { plausible: TrackerApi }) {
  return {
    trackEvent({ eventName }: { eventName: string }) {
      plausible.trackEvent(eventName);
    },
  };
}

function useTracker() {
  const plausible = inject<TrackerApi>('plausible');

  if (_.isNil(plausible)) {
    throw new TypeError('Plausible must be instantiated');
  }

  const tracker = createTrackerService({ plausible });

  return {
    tracker,
  };
}
