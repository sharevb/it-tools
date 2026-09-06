import { describe, expect, it } from 'vitest';
import { convertTextToUnicode, convertUnicodeToText } from './text-to-unicode.service';

describe('text-to-unicode', () => {
  describe('convertTextToUnicode', () => {
    it('a text string is converted to unicode representation', () => {
      expect(convertTextToUnicode('A')).toBe('&#65;');
      expect(convertTextToUnicode('💩 AĀ')).toBe('&#128169;&#32;&#65;&#256;');
      expect(convertTextToUnicode('💩 AĀ', { encoding: 'antiuni' })).toBe('\\u1f4a9\\u20\\u41\\u0100');
      expect(convertTextToUnicode('💩 AĀ', { encoding: 'css' })).toBe('\\01f4a9\\000020\\000041\\000100');
      expect(convertTextToUnicode('💩 AĀ', { encoding: 'htmldec' })).toBe('&#128169;&#32;&#65;&#256;');
      expect(convertTextToUnicode('💩 AĀ', { encoding: 'htmlhex' })).toBe('&#x1f4a9;&#x20;&#x41;&#x100;');
      expect(convertTextToUnicode('💩 AĀ', { encoding: 'uniplus' })).toBe('U+1f4a9 U+00020 U+00041 U+00100');
      expect(convertTextToUnicode('💩 AĀ', { encoding: 'python' })).toBe('\\U0001f4a9\\x20\\x41\\u0100');
      expect(convertTextToUnicode('💩 AĀ', { encoding: 'js' })).toBe('\\u{1f4a9}\\u0020\\u0041\\u0100');
      expect(convertTextToUnicode('💩 AĀ', { encoding: 'utf16' })).toBe('\\ud83d\\udca9\\u0020\\u0041\\u0100');
      expect(convertTextToUnicode('💩 hello AĀ', { skipAscii: true })).toBe('&#128169; hello A&#256;');
      expect(convertTextToUnicode('linke the string convert to unicode')).toBe(
        '&#108;&#105;&#110;&#107;&#101;&#32;&#116;&#104;&#101;&#32;&#115;&#116;&#114;&#105;&#110;&#103;&#32;&#99;&#111;&#110;&#118;&#101;&#114;&#116;&#32;&#116;&#111;&#32;&#117;&#110;&#105;&#99;&#111;&#100;&#101;',
      );
      expect(convertTextToUnicode('')).toBe('');
    });
  });

  describe('convertUnicodeToText', () => {
    it('an unicode string is converted to its text representation', () => {
      expect(convertUnicodeToText('&#65;')).toBe('A');
      expect(convertUnicodeToText('\\u1f4a9\\u20\\u41\\u0100')).toBe('💩 AĀ');
      expect(convertUnicodeToText('\\01f4a9\\000020\\000041\\000100')).toBe('💩 AĀ');
      expect(convertUnicodeToText('&#128169;&#32;&#65;&#256;')).toBe('💩 AĀ');
      expect(convertUnicodeToText('&#x1f4a9;&#x20;&#x41;&#x100;')).toBe('💩 AĀ');
      expect(convertUnicodeToText('U+1f4a9 U+00020 U+00041 U+00100')).toBe('💩 AĀ');
      expect(convertUnicodeToText('\\U0001f4a9\\x20\\x41\\u0100')).toBe('💩 AĀ');
      expect(convertUnicodeToText('\\u{1f4a9}\\u0020\\u0041\\u0100')).toBe('💩 AĀ');
      expect(convertUnicodeToText('\\ud83d\\udca9\\u0020\\u0041\\u0100')).toBe('💩 AĀ');
      expect(convertUnicodeToText('\\01f4a9 AĀ')).toBe('💩 AĀ');
      expect(convertUnicodeToText('&#128169; hello A&#256;')).toBe('💩 hello AĀ');
      expect(
        convertUnicodeToText(
          '&#108;&#105;&#110;&#107;&#101;&#32;&#116;&#104;&#101;&#32;&#115;&#116;&#114;&#105;&#110;&#103;&#32;&#99;&#111;&#110;&#118;&#101;&#114;&#116;&#32;&#116;&#111;&#32;&#117;&#110;&#105;&#99;&#111;&#100;&#101;',
        ),
      ).toBe('linke the string convert to unicode');
      expect(convertUnicodeToText('')).toBe('');
    });
  });
});
