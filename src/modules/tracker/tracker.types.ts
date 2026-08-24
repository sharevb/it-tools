import type { createTrackerService } from './tracker.services';

export type TrackerService = ReturnType<typeof createTrackerService>;

/**
 * The slice of the analytics tracker the app depends on. Keeping our own shape here means the tools
 * and the tracker service are not tied to the tracking library currently in use.
 */
export interface PlausibleInstance {
  trackEvent: (eventName: string) => void
  enableAutoPageviews: () => void
}
