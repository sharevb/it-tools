import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PlausibleConfig, PlausibleEventOptions } from '@plausible-analytics/tracker';
import { init, track } from '@plausible-analytics/tracker';
import { createPlausibleInstance } from './plausible.plugin';

vi.mock('@plausible-analytics/tracker', () => ({
  init: vi.fn<(config: PlausibleConfig) => void>(),
  track: vi.fn<(eventName: string, options: PlausibleEventOptions) => void>(),
}));

const enabledConfig = {
  isTrackerEnabled: true,
  domain: 'it-tools.tech',
  apiHost: 'https://plausible.example.com',
  trackLocalhost: false,
};

describe('plausible plugin', () => {
  beforeEach(() => {
    vi.mocked(init).mockClear();
    vi.mocked(track).mockClear();
  });

  describe('when the tracker is disabled', () => {
    it('does not initialize the tracker', () => {
      createPlausibleInstance({ config: { ...enabledConfig, isTrackerEnabled: false } });

      expect(init).not.toHaveBeenCalled();
    });

    it('returns an instance whose methods do nothing', () => {
      const plausible = createPlausibleInstance({ config: { ...enabledConfig, isTrackerEnabled: false } });

      plausible.enableAutoPageviews();
      plausible.trackEvent('some-event');

      expect(track).not.toHaveBeenCalled();
    });
  });

  describe('when no domain is configured', () => {
    it('does not initialize the tracker, as it would throw', () => {
      const plausible = createPlausibleInstance({ config: { ...enabledConfig, domain: '' } });

      plausible.trackEvent('some-event');

      expect(init).not.toHaveBeenCalled();
      expect(track).not.toHaveBeenCalled();
    });
  });

  describe('when the tracker is enabled', () => {
    it('initializes the tracker with the configured domain and endpoint', () => {
      createPlausibleInstance({ config: enabledConfig });

      expect(init).toHaveBeenCalledWith({
        domain: 'it-tools.tech',
        endpoint: 'https://plausible.example.com/api/event',
        captureOnLocalhost: false,
      });
    });

    it('keeps posting to a same origin endpoint when no api host is configured', () => {
      createPlausibleInstance({ config: { ...enabledConfig, apiHost: '' } });

      expect(init).toHaveBeenCalledWith(expect.objectContaining({ endpoint: '/api/event' }));
    });

    it('forwards the localhost tracking setting', () => {
      createPlausibleInstance({ config: { ...enabledConfig, trackLocalhost: true } });

      expect(init).toHaveBeenCalledWith(expect.objectContaining({ captureOnLocalhost: true }));
    });

    it('tracks events through the tracker', () => {
      const plausible = createPlausibleInstance({ config: enabledConfig });

      plausible.trackEvent('some-event');

      expect(track).toHaveBeenCalledWith('some-event', {});
    });

    it('does not enable pageviews twice, as init already captures them', () => {
      const plausible = createPlausibleInstance({ config: enabledConfig });
      vi.mocked(track).mockClear();

      plausible.enableAutoPageviews();

      expect(track).not.toHaveBeenCalled();
    });
  });
});
