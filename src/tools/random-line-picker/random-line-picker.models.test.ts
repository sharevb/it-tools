import { describe, expect, it } from 'vitest';
import { getLines, pickLines } from './random-line-picker.models';
import type { Config } from './random-line-picker.types';

describe('random-line-picker', () => {
  describe('getLines', () => {
    it('should split input into lines', () => {
      const config: Config = { input: 'a\nb\nc', count: 1, repeat: false, prefix: false };
      expect(getLines(config)).toEqual(['a', 'b', 'c']);
    });

    it('should return an empty array for empty input', () => {
      const config: Config = { input: '', count: 1, repeat: false, prefix: false };
      expect(getLines(config)).toEqual([]);
    });
  });

  describe('pickLines', () => {
    it('should return the correct number of lines', () => {
      const config: Config = { input: 'a\nb\nc\nd\ne', count: 3, repeat: false, prefix: false };
      const result = pickLines(config).split('\n');
      expect(result).toHaveLength(3);
    });

    it('should not exceed the number of available lines when repeat is false', () => {
      const config: Config = { input: 'a\nb\nc', count: 10, repeat: false, prefix: false };
      const result = pickLines(config).split('\n');
      expect(result).toHaveLength(3);
    });

    it('should allow picking more lines than available when repeat is true', () => {
      const config: Config = { input: 'a\nb', count: 5, repeat: true, prefix: false };
      const result = pickLines(config).split('\n');
      expect(result).toHaveLength(5);
    });

    it('should only return lines from the input', () => {
      const config: Config = { input: 'foo\nbar\nbaz', count: 3, repeat: false, prefix: false };
      const result = pickLines(config).split('\n');
      expect(result.every(line => ['foo', 'bar', 'baz'].includes(line))).toBe(true);
    });

    it('should not repeat lines when repeat is false', () => {
      const config: Config = { input: 'a\nb\nc', count: 3, repeat: false, prefix: false };
      const result = pickLines(config).split('\n');
      expect(new Set(result).size).toBe(result.length);
    });

    it('should add numeric prefix when prefix is true', () => {
      const config: Config = { input: 'a\nb\nc', count: 3, repeat: false, prefix: true };
      const result = pickLines(config).split('\n');
      expect(result[0]).toMatch(/^1\. /);
      expect(result[1]).toMatch(/^2\. /);
      expect(result[2]).toMatch(/^3\. /);
    });

    it('should not add prefix when prefix is false', () => {
      const config: Config = { input: 'a\nb\nc', count: 3, repeat: false, prefix: false };
      const result = pickLines(config).split('\n');
      expect(result.every(line => !/^\d+\. /.test(line))).toBe(true);
    });

    it('should return an empty string for empty input', () => {
      const config: Config = { input: '', count: 3, repeat: false, prefix: false };
      expect(pickLines(config)).toBe('');
    });

    it('should return a single line when count is 1', () => {
      const config: Config = { input: 'only', count: 1, repeat: false, prefix: false };
      expect(pickLines(config)).toBe('only');
    });
  });
});
