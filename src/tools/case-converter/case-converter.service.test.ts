import { describe, it, expect } from 'vitest';
import { toLanguageTitleCase, getSupportedLanguages } from './case-converter.service';

describe('toLanguageTitleCase – core behavior', () => {
  it('capitalizes normal words', () => {
    expect(toLanguageTitleCase('the quick brown fox', 'eng')).toBe('The Quick Brown Fox');
  });

  it('keeps stopwords lowercase except boundaries', () => {
    expect(toLanguageTitleCase('the lord of the rings', 'eng')).toBe('The Lord of the Rings');
  });

  it('handles empty input', () => {
    expect(toLanguageTitleCase('', 'eng')).toBe('');
  });

  it('handles single word', () => {
    expect(toLanguageTitleCase('hello', 'eng')).toBe('Hello');
  });
});

describe('toLanguageTitleCase – punctuation handling', () => {
  it('handles trailing punctuation', () => {
    expect(toLanguageTitleCase('hello, world!', 'eng')).toBe('Hello, World!');
  });

  it('handles starting punctuation', () => {
    expect(toLanguageTitleCase('(the lord of the rings)', 'eng')).toBe('(The Lord of the Rings)');
  });

  it('handles nested punctuation', () => {
    expect(toLanguageTitleCase('((the lord of the rings))', 'eng')).toBe('((The Lord of the Rings))');
  });

  it('handles unicode punctuation', () => {
    expect(toLanguageTitleCase('“the lord of the rings”', 'eng')).toBe('“The Lord of the Rings”');
  });

  it('handles mixed punctuation', () => {
    expect(toLanguageTitleCase('...the lord of the rings?!', 'eng')).toBe('...the Lord of the Rings?!');
    expect(toLanguageTitleCase('... the lord of the rings?!', 'eng')).toBe('... The Lord of the Rings?!');
  });

  it('handles punctuation inside sentence', () => {
    expect(toLanguageTitleCase('hello: the lord of the rings', 'eng')).toBe('Hello: the Lord of the Rings');
  });
});

describe('toLanguageTitleCase – French elisions', () => {
  it('handles basic elision', () => {
    expect(toLanguageTitleCase("l'homme et la mer", 'fra')).toBe('L’Homme et la Mer');
  });

  it('handles elision with punctuation', () => {
    expect(toLanguageTitleCase("“l'homme”", 'fra')).toBe('“L’Homme”');
  });

  it('handles multiple elisions', () => {
    expect(toLanguageTitleCase("d'amour et d'etoiles", 'fra')).toBe('D’Amour et d’Etoiles');
  });

  it('handles elisions with starting punctuation', () => {
    expect(toLanguageTitleCase("(l'amour", 'fra')).toBe('(L’Amour');
  });

  it('handles elisions with trailing punctuation', () => {
    expect(toLanguageTitleCase("l'homme!", 'fra')).toBe('L’Homme!');
  });

  it('handles elisions with unicode apostrophes', () => {
    expect(toLanguageTitleCase('l’homme et l’amour', 'fra')).toBe('L’Homme et l’Amour');
  });
});

describe('toLanguageTitleCase – advanced cases', () => {
  it('handles numbers', () => {
    expect(toLanguageTitleCase('the 7 wonders of the world', 'eng')).toBe('The 7 Wonders of the World');
  });

  it('handles acronyms', () => {
    expect(toLanguageTitleCase('the nasa launch', 'eng')).toBe('The Nasa Launch');
  });

  it('handles hyphenated words', () => {
    expect(toLanguageTitleCase('the state-of-the-art system', 'eng')).toBe('The State-of-the-art System');
  });

  it('handles mixed languages', () => {
    expect(toLanguageTitleCase("l'homme et l'homme and the sea", 'fra')).toBe('L’Homme et l’Homme And The Sea');
  });

  it('handles multiple spaces', () => {
    expect(toLanguageTitleCase('the   lord   of   the   rings', 'eng')).toBe('The Lord of the Rings');
  });

  it('handles tabs and newlines', () => {
    expect(toLanguageTitleCase('the\tlord\nof the rings', 'eng')).toBe('The Lord of the Rings');
  });

  it('handles uppercase input', () => {
    expect(toLanguageTitleCase('THE LORD OF THE RINGS', 'eng')).toBe('The Lord of the Rings');
  });

  it('handles mixed case input', () => {
    expect(toLanguageTitleCase('tHe LoRd oF tHe RiNgS', 'eng')).toBe('The Lord of the Rings');
  });

  it('handles sentences input', () => {
    expect(toLanguageTitleCase('tHe LoRd. oF tHe RiNgS', 'eng')).toBe('The Lord. Of the Rings');
  });
});

describe('getSupportedLanguages', () => {
  it('includes english stopwords', () => {
    const langs = getSupportedLanguages();
    const en = langs.find((l) => l.value === 'eng');
    expect(en).toBeDefined();
    expect(en!.label).toBe('English');
  });
});
