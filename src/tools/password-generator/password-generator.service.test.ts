import { describe, expect, it } from 'vitest';
import { generatePassword } from './password-generator.service';

describe('generatePassword', () => {
  const defaultOptions = {
    length: 12,
    withLowercase: true,
    withUppercase: true,
    withNumbers: true,
    withSymbols: true,
  };

  it('generates a password with every enabled character type', () => {
    const password = generatePassword(defaultOptions);

    expect(password).toHaveLength(12);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%^&*()\-_=+\[\]{};:,.?/]/);
  });

  it('excludes requested characters', () => {
    const password = generatePassword({ ...defaultOptions, excludedChars: 'aAZ0!' });

    expect(password).not.toMatch(/[aAZ0!]/);
  });

  it('requires a length of at least four characters', () => {
    expect(() => generatePassword({ ...defaultOptions, length: 3 })).toThrow(RangeError);
  });

  it('rejects settings without usable characters', () => {
    expect(() => generatePassword({
      ...defaultOptions,
      withUppercase: false,
      withNumbers: false,
      withSymbols: false,
      excludedChars: 'abcdefghijklmnopqrstuvwxyz',
    })).toThrow(RangeError);
  });
});
