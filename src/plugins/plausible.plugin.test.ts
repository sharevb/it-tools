import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PlausibleConfig, PlausibleEventOptions } from '@plausible-analytics/tracker';

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

// The plugin remembers whether the tracker has been initialized, so every test starts from a fresh
// copy of the module.
async function loadPlugin() {
  vi.resetModules();

  const { init, track } = await import('@plausible-analytics/tracker');
  const { createPlausibleInstance } = await import('./plausible.plugin');

  return { createPlausibleInstance, init: vi.mocked(init), track: vi.mocked(track) };
}

describe('plausible plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when the tracker is disabled', () => {
    it('does not initialize the tracker', async () => {
      const { createPlausibleInstance, init } = await loadPlugin();

      createPlausibleInstance({ config: { ...enabledConfig, isTrackerEnabled: false } });

      expect(init).not.toHaveBeenCalled();
    });

    it('returns an instance whose methods do nothing', async () => {
      const { createPlausibleInstance, track } = await loadPlugin();

      const plausible = createPlausibleInstance({ config: { ...enabledConfig, isTrackerEnabled: false } });
      plausible.enableAutoPageviews();
      plausible.trackEvent('some-event');

      expect(track).not.toHaveBeenCalled();
    });
  });

  describe('when no domain is configured', () => {
    it('does not initialize the tracker, as it would throw', async () => {
      const { createPlausibleInstance, init, track } = await loadPlugin();

      createPlausibleInstance({ config: { ...enabledConfig, domain: '' } }).trackEvent('some-event');

      expect(init).not.toHaveBeenCalled();
      expect(track).not.toHaveBeenCalled();
    });
  });

  describe('when the tracker is enabled', () => {
    it('initializes the tracker with the configured domain and endpoint', async () => {
      const { createPlausibleInstance, init } = await loadPlugin();

      createPlausibleInstance({ config: enabledConfig });

      expect(init).toHaveBeenCalledWith({
        domain: 'it-tools.tech',
        endpoint: 'https://plausible.example.com/api/event',
        captureOnLocalhost: false,
      });
    });

    it('keeps posting to a same origin endpoint when no api host is configured', async () => {
      const { createPlausibleInstance, init } = await loadPlugin();

      createPlausibleInstance({ config: { ...enabledConfig, apiHost: '' } });

      expect(init).toHaveBeenCalledWith(expect.objectContaining({ endpoint: '/api/event' }));
    });

    it('does not double the slash when the api host ends with one', async () => {
      const { createPlausibleInstance, init } = await loadPlugin();

      createPlausibleInstance({ config: { ...enabledConfig, apiHost: 'https://plausible.example.com/' } });

      expect(init).toHaveBeenCalledWith(
        expect.objectContaining({ endpoint: 'https://plausible.example.com/api/event' }),
      );
    });

    it('forwards the localhost tracking setting', async () => {
      const { createPlausibleInstance, init } = await loadPlugin();

      createPlausibleInstance({ config: { ...enabledConfig, trackLocalhost: true } });

      expect(init).toHaveBeenCalledWith(expect.objectContaining({ captureOnLocalhost: true }));
    });

    it('tracks events through the tracker', async () => {
      const { createPlausibleInstance, track } = await loadPlugin();

      createPlausibleInstance({ config: enabledConfig }).trackEvent('some-event');

      expect(track).toHaveBeenCalledWith('some-event', {});
    });

    it('does not enable pageviews twice, as init already captures them', async () => {
      const { createPlausibleInstance, track } = await loadPlugin();

      createPlausibleInstance({ config: enabledConfig }).enableAutoPageviews();

      expect(track).not.toHaveBeenCalled();
    });

    it('initializes the tracker only once, as a second init would throw', async () => {
      const { createPlausibleInstance, init, track } = await loadPlugin();

      createPlausibleInstance({ config: enabledConfig });
      const second = createPlausibleInstance({ config: enabledConfig });

      expect(init).toHaveBeenCalledTimes(1);

      // the already running tracker stays usable from the second instance
      second.trackEvent('some-event');
      expect(track).toHaveBeenCalledWith('some-event', {});
    });
  });
});
