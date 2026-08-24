import { type LanguageCode } from 'stopword';
import * as stopwords from 'stopword';
import langs from 'langs';

const STARTING_PUNCT = /^[({[\“"']+/;
const TRAILING_PUNCT = /[.,;:!?'"”’)\]}]+$/;
const FRENCH_ELISION = /^(l|d|j|t|m|n|s|c|qu)['’](.+)$/iu;

/**
 * Returns an array of { code, words } for all supported languages.
 */
export function getSupportedLanguages(): Array<{ value: string; label: string }> {
  return Object.entries(stopwords).map(([code]) => ({
    label: langs.where('3', code)?.name ?? code,
    value: code,
  }));
}

/**
 * Title Case with stopwords, punctuation handling (start & end),
 * and French elisions.
 */
export function toLanguageTitleCase(input: string, lang: string = 'eng'): string {
  const stop = new Set(stopwords[lang as LanguageCode] ?? []);

  const words = input
    .trim()
    .split(/\s+/)
    .map((w) => w.toLowerCase());

  let wasBoundary = true; // Start of string is a boundary
  return words
    .map((rawWord) => {
      // Extract starting punctuation
      const startMatch = rawWord.match(STARTING_PUNCT);
      const startPunct = startMatch ? startMatch[0] : '';
      const withoutStart = startPunct ? rawWord.slice(startPunct.length) : rawWord;

      // Extract trailing punctuation
      const endMatch = withoutStart.match(TRAILING_PUNCT);
      const endPunct = endMatch ? endMatch[0] : '';
      const core = endPunct ? withoutStart.slice(0, -endPunct.length) : withoutStart;

      const isBoundary = wasBoundary;
      const isStopword = stop.has(core);

      wasBoundary = withoutStart.match(/[.!?]['"”’)\]}]*$/) !== null;

      if (lang === 'fra') {
        const elision = core.match(FRENCH_ELISION);
        if (elision) {
          const [, prefix, rest] = elision;
          const capPrefix = isBoundary ? prefix.charAt(0).toUpperCase() + prefix.slice(1) : prefix;
          const capRest = rest.charAt(0).toUpperCase() + rest.slice(1);
          return `${startPunct}${capPrefix}’${capRest}${endPunct}`;
        }
      }

      if (isStopword && !isBoundary) {
        return `${startPunct}${core}${endPunct}`;
      }

      // Default capitalization
      const cap = core.charAt(0).toUpperCase() + core.slice(1);
      return `${startPunct}${cap}${endPunct}`;
    })
    .join(' ');
}
