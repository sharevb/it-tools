import { describe, expect, it } from 'vitest';
import { SANType_DNSName, SANType_DirectoryName, SANType_IPAddress, SANType_OtherName, SANType_Rfc822Name, SANType_UniformResourceIdentifier, getSANType, getSubjectAlternativeNames, toPositiveHex } from './crypto';

describe('toPositiveHex function', () => {
  it('should return the same hex string if the most significant hex is less than 8', () => {
    expect(toPositiveHex('2a3f')).toBe('2a3f');
    expect(toPositiveHex('7fff')).toBe('7fff');
  });

  it('should modify the most significant hex digit if it is greater than or equal to 8', () => {
    expect(toPositiveHex('8a3f')).toBe('0a3f');
    expect(toPositiveHex('f234')).toBe('7234');
  });
});

describe('getSANType function', () => {
  it('should return SANType_UniformResourceIdentifier for URI-like strings', () => {
    expect(getSANType('http://example.com')).toBe(SANType_UniformResourceIdentifier);
    expect(getSANType('https://example.com')).toBe(SANType_UniformResourceIdentifier);
  });

  it('should return SANType_DNSName for DNS-like strings', () => {
    expect(getSANType('example.com')).toBe(SANType_DNSName);
    expect(getSANType('*.example.com')).toBe(SANType_DNSName);
  });

  it('should return SANType_Rfc822Name for email addresses', () => {
    expect(getSANType('user@example.com')).toBe(SANType_Rfc822Name);
  });

  it('should return SANType_IPAddress for valid IP addresses', () => {
    expect(getSANType('192.168.0.1')).toBe(SANType_IPAddress);
    expect(getSANType('255.255.255.255')).toBe(SANType_IPAddress);
  });

  it('should return SANType_DirectoryName for strings containing "DC="', () => {
    expect(getSANType('DC=example')).toBe(SANType_DirectoryName);
  });

  it('should return SANType_OtherName for all other cases', () => {
    expect(getSANType('randomString')).toBe(SANType_OtherName);
    expect(getSANType('')).toBe(SANType_OtherName);
    expect(getSANType('1234')).toBe(SANType_OtherName);
  });
});

describe('getSubjectAlternativeNames function', () => {
  it('should return null if input is empty or undefined', () => {
    expect(getSubjectAlternativeNames(undefined)).toBeNull();
    expect(getSubjectAlternativeNames('')).toBeNull();
    expect(getSubjectAlternativeNames('   ')).toBeNull();
  });

  it('should return a structured object with parsed SAN values', () => {
    const input = 'http://example.com\nuser@example.com\n192.168.0.1';
    const result = getSubjectAlternativeNames(input);
    expect(result).toEqual({
      name: 'subjectAltName',
      altNames: [
        { type: SANType_UniformResourceIdentifier, value: 'http://example.com' },
        { type: SANType_Rfc822Name, value: 'user@example.com' },
        { type: SANType_IPAddress, ip: '192.168.0.1' },
      ],
    });
  });

  it('should ignore empty lines and trim whitespace', () => {
    const input = '  \n http://example.com \n  \n user@example.com \n';
    const result = getSubjectAlternativeNames(input);
    expect(result?.altNames).toEqual([
      { type: SANType_UniformResourceIdentifier, value: 'http://example.com' },
      { type: SANType_Rfc822Name, value: 'user@example.com' },
    ]);
  });
});
