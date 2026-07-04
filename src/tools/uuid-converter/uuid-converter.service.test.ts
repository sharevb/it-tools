import { describe, expect, it } from 'vitest';
import { getVersion, normalizeUUID, UUID2HEX } from './uuid-converter.service';

const validUuid = '005056a3-e753-1eee-97a1-e5eb141bb52c';
const validUuidHex = '005056A3E7531EEE97A1E5EB141BB52C';
const inValidUuid = '005056a3-e753-1eee-97a1-e5eb141bb52x';

describe('uuid-converter', () => {
  describe('normalizeUUID', () => {
    it('a valid UUID should be returned without changes', () => {
      expect(normalizeUUID(validUuid)).toBe(validUuid);
    });
    it('an invalid UUID should return an empty string', () => {
      expect(normalizeUUID(inValidUuid)).toBe('');
    });
    it('a packed UUID in hex format should return its valid UUID', () => {
      expect(normalizeUUID(validUuidHex)).toBe(validUuid);
    });
  });

  describe('uUID2HEX', () => {
    it('a UUID is converted to upper case hex notation', () => {
      expect(UUID2HEX(validUuid)).toBe(validUuidHex.toUpperCase());
    });
    it('a UUID is converted to lower case hex notation', () => {
      expect(UUID2HEX(validUuid, false)).toBe(validUuidHex.toLowerCase());
    });
    it('an invalid UUID should return an empty string', () => {
      expect(UUID2HEX(inValidUuid)).toBe('');
    });
  });

  describe('getVersion', () => {
    it('returns the RFC version of the UUID as string', () => {
      expect(getVersion(validUuid)).toBe('1');
    });
  });
  it('an invalid UUID should return an empty string', () => {
    expect(getVersion(inValidUuid)).toBe('');
  });
});
