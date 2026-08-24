import { describe, expect, it } from 'vitest';
import { getSecretKey } from './django-secret-generator.service';

describe('django-secret-generator', () => {
  describe('getSecretKey', () => {
    it('should return a value between 50 and 60 chars', () => {
      const key = getSecretKey();

      expect(key.length).toBeGreaterThanOrEqual(50);
      expect(key.length).toBeLessThanOrEqual(60);
    });

    it('should only use characters from the django alphabet', () => {
      // Anchored, and `-` escaped: unescaped it reads as the range `(` to `_`,
      // which would also accept digits and uppercase letters.
      expect(getSecretKey()).toMatch(/^[a-z0-9!@#$%^&*()\-_=+]+$/);
    });
  });
});
