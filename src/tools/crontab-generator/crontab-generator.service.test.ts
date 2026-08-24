import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCronType, getLastExecutionTimes, isCronValid } from './crontab-generator.service';

describe('crontab-generator', () => {
  describe('isCronValid', () => {
    it('should return true for all valid formats', () => {
      // standard format
      expect(isCronValid('0 0 * * 1-5')).toBe(true);
      expect(isCronValid('23 0-20/2 * * *')).toBe(true);

      // AWS formats
      expect(isCronValid('0 11-22 ? * MON-FRI *')).toBe(true);
      expect(isCronValid('0 0 ? * 1 *')).toBe(true);
    });
    it('should check standard format', () => {
      // standard format
      expect(isCronValid('0 0 * * 1-5', 'standard')).toBe(true);
      expect(isCronValid('23 0-20/2 * * *', 'standard')).toBe(true);

      // AWS format
      expect(isCronValid('0 11-22 ? * MON-FRI *', 'standard')).toBe(false);
      expect(isCronValid('0 0 ? * 1 *', 'standard')).toBe(false);
    });
    it('should check aws format', () => {
      // standard format
      expect(isCronValid('0 0 * * 1-5', 'aws')).toBe(false);
      expect(isCronValid('23 0-20/2 * * *', 'aws')).toBe(false);

      // AWS format
      expect(isCronValid('0 11-22 ? * MON-FRI *', 'aws')).toBe(true);
      expect(isCronValid('0 0 ? * 1 *', 'aws')).toBe(true);
    });
    it('should return false for all invalid formats', () => {
      expect(isCronValid('aert')).toBe(false);
      expect(isCronValid('40 *')).toBe(false);
      expect(isCronValid('* * * *')).toBe(false);
    });
  });

  describe('getCronType', () => {
    it('should return right type', () => {
      expect(getCronType('0 0 * * 1-5')).toBe('standard');
      expect(getCronType('23 0-20/2 * * *')).toBe('standard');

      // AWS formats
      expect(getCronType('0 11-22 ? * MON-FRI *')).toBe('aws');
      expect(getCronType('0 0 ? * 1 *')).toBe('aws');

      expect(getCronType('aert')).toBe(false);
      expect(getCronType('40 *')).toBe(false);
    });

    // The two dialects overlap: a 6 field expression parses as standard cron with seconds and as an
    // AWS expression alike. These pin which side each expression is expected to land on.
    it.each<[string, 'standard' | 'aws' | false]>([
      ['* * * * *', 'standard'],
      ['* * * * * *', 'standard'],
      ['@daily', 'standard'],
      ['@hourly', 'standard'],
      ['*/5 * * * *', 'standard'],
      ['0 0 * * SUN', 'standard'],
      ['5 4 * * sun', 'standard'],
      ['0 0 29 2 *', 'standard'],
      ['0 0,12 1 */2 *', 'standard'],
      ['0 10 * * ? *', 'aws'],
      ['15 12 * * ? *', 'aws'],
      ['0 8 1 * ? *', 'aws'],
      ['0/5 8-17 ? * MON-FRI *', 'aws'],
      ['0 9 ? * 2#1 *', 'aws'],
      ['30 9 L * ? *', 'aws'],
      ['0 0 1 1 ? 2026', 'aws'],
      ['', false],
      ['   ', false],
      ['60 * * * *', false],
      ['0 0 32 * *', false],
    ])('classifies %s as %s', (expression, type) => {
      expect(getCronType(expression)).toBe(type);
    });
  });

  describe('getLastExecutionTimes', () => {
    it('should return next valid datetimes', () => {
      expect(getLastExecutionTimes('0 0 * * 1-5')).toHaveLength(5);
      expect(getLastExecutionTimes('23 0-20/2 * * *')).toHaveLength(5);

      // AWS formats
      expect(getLastExecutionTimes('0 11-22 ? * MON-FRI *')).toHaveLength(5);
      expect(getLastExecutionTimes('0 0 ? * 1 *')).toHaveLength(5);
    });

    describe('with the clock frozen', () => {
      beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-03-01T00:00:00.000Z'));
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('returns the exact next execution times of a standard expression', () => {
        expect(getLastExecutionTimes('0 0 * * 1-5', undefined, 3)).toEqual([
          '2026-03-02T00:00:00.000+00:00',
          '2026-03-03T00:00:00.000+00:00',
          '2026-03-04T00:00:00.000+00:00',
        ]);
        expect(getLastExecutionTimes('23 0-20/2 * * *', undefined, 3)).toEqual([
          '2026-03-01T00:23:00.000+00:00',
          '2026-03-01T02:23:00.000+00:00',
          '2026-03-01T04:23:00.000+00:00',
        ]);
        expect(getLastExecutionTimes('*/15 * * * *', undefined, 3)).toEqual([
          '2026-03-01T00:15:00.000+00:00',
          '2026-03-01T00:30:00.000+00:00',
          '2026-03-01T00:45:00.000+00:00',
        ]);
      });

      it('applies the requested timezone, offset included', () => {
        expect(getLastExecutionTimes('0 12 * * *', 'America/New_York', 3)).toEqual([
          '2026-03-01T12:00:00.000-05:00',
          '2026-03-02T12:00:00.000-05:00',
          '2026-03-03T12:00:00.000-05:00',
        ]);
        expect(getLastExecutionTimes('0 12 * * *', 'Asia/Tokyo', 2)).toEqual([
          '2026-03-01T12:00:00.000+09:00',
          '2026-03-02T12:00:00.000+09:00',
        ]);
      });

      // The aws branch goes through event-cron-parser, which does not read the faked clock, so only
      // the shape is pinned here rather than a frozen instant.
      it('returns parseable datetimes for an aws expression', () => {
        const times = getLastExecutionTimes('0 11-22 ? * MON-FRI *', undefined, 2);

        expect(times).toHaveLength(2);
        for (const time of times) {
          expect(Number.isNaN(Date.parse(JSON.parse(time)))).toBe(false);
        }
      });

      it('returns nothing for an invalid expression', () => {
        expect(getLastExecutionTimes('aert')).toEqual([]);
      });
    });
  });
});
