import { describe, expect, test } from 'vitest';
import { getTimeZoneOptionLabel, isAllowedTimeZone, resolveBrowserTimeZone, resolveIanaTimeZone } from './date-time-converter.timezones';

describe('date-time-converter timezones', () => {
  describe('resolveIanaTimeZone', () => {
    test('keeps canonical IANA timezones unchanged', () => {
      expect(resolveIanaTimeZone('America/New_York')).toBe('America/New_York');
    });

    test('keeps a primary timezone when Intl rewrites it to an alias', () => {
      expect(resolveIanaTimeZone('Asia/Kolkata')).toBe('Asia/Kolkata');
      expect(resolveIanaTimeZone('Europe/Kyiv')).toBe('Europe/Kyiv');
    });

    test('rejects aliases that are not selectable IANA options', () => {
      expect(resolveIanaTimeZone('Asia/Calcutta')).toBe('Etc/UTC');
      expect(resolveIanaTimeZone('Europe/Kiev')).toBe('Etc/UTC');
    });

    test('falls back when timezone is invalid', () => {
      expect(resolveIanaTimeZone('Not/A_Timezone')).toBe('Etc/UTC');
      expect(resolveIanaTimeZone('Not/A_Timezone', 'America/New_York')).toBe('America/New_York');
    });
  });

  describe('resolveBrowserTimeZone', () => {
    test('canonicalizes browser aliases to selectable IANA zones', () => {
      expect(resolveBrowserTimeZone('Asia/Calcutta')).toBe('Asia/Kolkata');
      expect(resolveBrowserTimeZone('Europe/Kiev')).toBe('Europe/Kyiv');
    });

    test('keeps canonical browser timezones unchanged', () => {
      expect(resolveBrowserTimeZone('America/New_York')).toBe('America/New_York');
    });
  });

  describe('isAllowedTimeZone', () => {
    test('accepts only currently selectable timezone values', () => {
      expect(isAllowedTimeZone('America/New_York')).toBe(true);
      expect(isAllowedTimeZone('Asia/Calcutta')).toBe(false);
      expect(isAllowedTimeZone('Not/A_Timezone')).toBe(false);
    });
  });

  describe('getTimeZoneOptionLabel', () => {
    test('shows both standard and daylight offsets for DST-aware zones', () => {
      expect(getTimeZoneOptionLabel({
        browserTimezone: 'Etc/UTC',
        dstOffsetStr: '-04:00',
        name: 'America/New_York',
        utcOffsetStr: '-05:00',
      })).toBe('America/New_York (-05:00/-04:00)');
    });

    test('marks the browser timezone in the label', () => {
      expect(getTimeZoneOptionLabel({
        browserTimezone: 'America/New_York',
        dstOffsetStr: '-04:00',
        name: 'America/New_York',
        utcOffsetStr: '-05:00',
      })).toBe('Browser TZ - America/New_York (-05:00/-04:00)');
    });
  });
});
