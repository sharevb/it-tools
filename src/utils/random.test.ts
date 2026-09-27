import { afterEach, describe, expect, it, vi } from 'vitest';
import { randFromArray, randIndex, randIntFromInterval, random, shuffleArray } from './random';

describe('random', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not use Math.random', () => {
    const spy = vi.spyOn(Math, 'random');
    random();
    randIndex(10);
    shuffleArray([1, 2, 3]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('random() returns floats in [0, 1)', () => {
    for (let i = 0; i < 1000; i++) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('randIndex() covers [0, max) and rejects invalid bounds', () => {
    const seen = new Set(Array.from({ length: 1000 }, () => randIndex(3)));
    expect([...seen].sort((a, b) => a - b)).toEqual([0, 1, 2]);
    expect(() => randIndex(0)).toThrow(RangeError);
    expect(() => randIndex(1.5)).toThrow(RangeError);
    expect(() => randIndex(2 ** 53 + 2)).toThrow(RangeError);
  });

  it('randIntFromInterval() includes both bounds', () => {
    const seen = new Set(Array.from({ length: 1000 }, () => randIntFromInterval(5, 7)));
    expect([...seen].sort((a, b) => a - b)).toEqual([5, 6, 7]);
  });

  it('randIntFromInterval() accepts reversed and fractional bounds', () => {
    const reversed = new Set(Array.from({ length: 1000 }, () => randIntFromInterval(8, 3)));
    expect([...reversed].sort((a, b) => a - b)).toEqual([3, 4, 5, 6, 7, 8]);
    const fractional = new Set(Array.from({ length: 1000 }, () => randIntFromInterval(2.5, 4)));
    expect([...fractional].sort((a, b) => a - b)).toEqual([3, 4]);
    expect(randIntFromInterval(2.2, 2.8)).toBe(3);
    expect(randIntFromInterval(Number.NaN, 4)).toBeNaN();
  });

  it('randIntFromInterval() handles ranges wider than 2^32', () => {
    for (const [min, max] of [
      [1, 2 ** 32 + 1],
      [-(2 ** 52), 2 ** 52],
      [-Number.MAX_VALUE, Number.MAX_VALUE],
    ]) {
      const value = randIntFromInterval(min, max);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
    }
    const aboveUint32 = Array.from({ length: 200 }, () => randIntFromInterval(0, 2 ** 40));
    expect(aboveUint32.some((value) => value > 2 ** 32)).toBe(true);
  });

  it('randFromArray() returns undefined for an empty array', () => {
    expect(randFromArray([])).toBeUndefined();
    expect(randFromArray(['a'])).toBe('a');
  });

  it('shuffleArray() returns a permutation without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(input);
  });
});
