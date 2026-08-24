import { describe, expect, it, vi } from 'vitest';
import type { PlausibleInstance } from './tracker.types';
import { createTrackerService, useTracker } from './tracker.services';

function createPlausibleStub(): PlausibleInstance {
  return {
    trackEvent: vi.fn<(eventName: string) => void>(),
    enableAutoPageviews: vi.fn<() => void>(),
  };
}

describe('tracker service', () => {
  describe('createTrackerService', () => {
    it('forwards the event name to the tracker', () => {
      const plausible = createPlausibleStub();

      createTrackerService({ plausible }).trackEvent({ eventName: 'tool-opened' });

      expect(plausible.trackEvent).toHaveBeenCalledWith('tool-opened');
    });
  });

  describe('useTracker', () => {
    it('throws when no tracker has been provided', () => {
      expect(() => useTracker()).toThrow(new TypeError('Plausible must be instantiated'));
    });
  });
});
