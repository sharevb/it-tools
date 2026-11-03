import { describe, expect, it } from 'vitest';
import {
  formatSignalNumber,
  getCurrentLoopStatus,
  getLinearTransform,
  getSignalRangeStatus,
  scaleValue,
  toPercentOfRange,
} from './analog-signal';

describe('analog-signal', () => {
  describe('scaleValue', () => {
    it('maps a 4-20 mA current onto an engineering range', () => {
      const from = { min: 4, max: 20 };
      const to = { min: 0, max: 10 };

      expect(scaleValue({ value: 4, from, to })).toBe(0);
      expect(scaleValue({ value: 12, from, to })).toBe(5);
      expect(scaleValue({ value: 20, from, to })).toBe(10);
    });

    it('maps the other way round, from engineering value to current', () => {
      expect(scaleValue({ value: 2.5, from: { min: 0, max: 10 }, to: { min: 4, max: 20 } })).toBe(8);
    });

    it('handles negative and inverted ranges', () => {
      expect(scaleValue({ value: 0, from: { min: -27648, max: 27648 }, to: { min: -10, max: 10 } })).toBe(0);
      expect(scaleValue({ value: 27648, from: { min: -27648, max: 27648 }, to: { min: -10, max: 10 } })).toBe(10);
      expect(scaleValue({ value: 4, from: { min: 4, max: 20 }, to: { min: 100, max: 0 } })).toBe(100);
    });

    it('scales Siemens raw values', () => {
      expect(scaleValue({ value: 13824, from: { min: 0, max: 27648 }, to: { min: 0, max: 100 } })).toBe(50);
    });

    it('extrapolates outside of the range', () => {
      expect(scaleValue({ value: 0, from: { min: 4, max: 20 }, to: { min: 0, max: 16 } })).toBe(-4);
    });

    it('throws on an empty input range', () => {
      expect(() => scaleValue({ value: 1, from: { min: 4, max: 4 }, to: { min: 0, max: 10 } })).toThrow();
      expect(() => scaleValue({ value: 1, from: { min: Number.NaN, max: 4 }, to: { min: 0, max: 10 } })).toThrow();
    });
  });

  describe('getLinearTransform', () => {
    it('returns gain and offset of y = gain * x + offset', () => {
      expect(getLinearTransform({ from: { min: 4, max: 20 }, to: { min: 0, max: 16 } })).toEqual({
        gain: 1,
        offset: -4,
      });
    });
  });

  describe('toPercentOfRange', () => {
    it('gives the position in the range', () => {
      expect(toPercentOfRange({ value: 8, range: { min: 4, max: 20 } })).toBe(25);
      expect(toPercentOfRange({ value: 2, range: { min: 2, max: 10 } })).toBe(0);
    });
  });

  describe('getSignalRangeStatus', () => {
    it('detects values outside of the range', () => {
      expect(getSignalRangeStatus({ value: 5, range: { min: 0, max: 10 } })).toBe('ok');
      expect(getSignalRangeStatus({ value: -0.1, range: { min: 0, max: 10 } })).toBe('below-range');
      expect(getSignalRangeStatus({ value: 10.1, range: { min: 0, max: 10 } })).toBe('above-range');
      expect(getSignalRangeStatus({ value: 5, range: { min: 10, max: 0 } })).toBe('ok');
    });
  });

  describe('getCurrentLoopStatus', () => {
    it('follows NAMUR NE 43 limits', () => {
      expect(getCurrentLoopStatus(0)).toBe('failure-low');
      expect(getCurrentLoopStatus(3.6)).toBe('failure-low');
      expect(getCurrentLoopStatus(3.7)).toBe('uncertain-low');
      expect(getCurrentLoopStatus(3.8)).toBe('under-range');
      expect(getCurrentLoopStatus(4)).toBe('ok');
      expect(getCurrentLoopStatus(20)).toBe('ok');
      expect(getCurrentLoopStatus(20.5)).toBe('over-range');
      expect(getCurrentLoopStatus(20.8)).toBe('uncertain-high');
      expect(getCurrentLoopStatus(21)).toBe('failure-high');
    });
  });

  describe('formatSignalNumber', () => {
    it('removes float noise', () => {
      expect(formatSignalNumber(0.1 + 0.2)).toBe('0.3');
      expect(formatSignalNumber(12.345678)).toBe('12.3457');
      expect(formatSignalNumber(-0.00001)).toBe('0');
      expect(formatSignalNumber(Number.NaN)).toBe('');
    });
  });
});
