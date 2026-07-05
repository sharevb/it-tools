import { describe, expect, it } from 'vitest';

import { dbmToMw, mwToDbm } from './dbm-mw-converter.service'; // Adjust path as needed

describe('Power Conversion Utilities', () => {
  describe('dbmToMw', () => {
    it('should convert 30 dBm to 1 W', () => {
      expect(dbmToMw(30)).toBeCloseTo(1000, 5);
    });

    it('should convert 0 dBm to 1 mW', () => {
      expect(dbmToMw(0)).toBeCloseTo(1, 5);
    });

    it('should convert 10 dBm to 10 mW', () => {
      expect(dbmToMw(10)).toBeCloseTo(10, 5);
    });

    it('should convert -30 dBm to 0.001 mW', () => {
      expect(dbmToMw(-30)).toBeCloseTo(0.001, 5);
    });
  });

  describe('mwToDbm', () => {
    it('should convert 1 mW to 0 dBm', () => {
      expect(mwToDbm(1)).toBeCloseTo(0, 5);
    });

    it('should convert 10 mW to 10 dBm', () => {
      expect(mwToDbm(10)).toBeCloseTo(10, 5);
    });

    it('should throw an error for non-positive input', () => {
      expect(() => mwToDbm(0)).toThrow();
      expect(() => mwToDbm(-5)).toThrow();
    });
  });
});
