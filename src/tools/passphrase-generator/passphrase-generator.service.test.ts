import { describe, expect, it, vi } from 'vitest';
import { generatePassphrase } from './passphrase-generator.service';

describe('passphrase-generator', () => {
  describe('generatePassphrase', () => {
    it('does not use Math.random', () => {
      const spy = vi.spyOn(Math, 'random');
      generatePassphrase({ wordCount: 5, numberCount: 2 });
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('generates the requested number of lowercase words', () => {
      const passphrase = generatePassphrase({ wordCount: 6, separator: '|' });
      expect(passphrase).toMatch(/^[a-z|]+$/);
      expect(passphrase.split('|').length).toBeGreaterThanOrEqual(6);
    });

    it('adds a number to exactly the requested amount of words', () => {
      const passphrase = generatePassphrase({ wordCount: 4, numberCount: 4 });
      expect(passphrase.match(/\d+/g)).toHaveLength(4);
      for (const value of passphrase.match(/\d+/g)!) {
        expect(Number(value)).toBeGreaterThanOrEqual(1);
        expect(Number(value)).toBeLessThanOrEqual(100);
      }
    });

    it('capitalizes the first letter and appends the salt', () => {
      const passphrase = generatePassphrase({ wordCount: 3, capitalize: true, salt: '!?' });
      expect(passphrase).toMatch(/^[A-Z]/);
      expect(passphrase.endsWith('!?')).toBe(true);
    });
  });
});
