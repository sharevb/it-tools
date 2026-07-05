import { describe, expect, it } from 'vitest';
import { getSecretKey } from './django-secret-generator.service';

describe('django-secret-generato', () => {
  describe('getSecretKey', () => {
    it('should return a value between 50 and 60 chars', () => {
      expect(getSecretKey()).toMatch(/[abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)]{50,60}/);
    });
  });
});
