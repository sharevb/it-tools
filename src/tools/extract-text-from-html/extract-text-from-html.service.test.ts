import { describe, expect, it } from 'vitest';
import { getTextFromHtml, validateHtml } from './extract-text-from-html.service';

describe('extract-text-from-html service', () => {
  describe('validateHtml', () => {
    it('check if the value is valid html', () => {
      expect(validateHtml('<p>Paste your HTML in the input form on the left</p>')).toBeTruthy();
      expect(validateHtml('<div>Paste your HTML in the input form on the left</div>')).toBeTruthy();
      expect(validateHtml('<div><p>Paste your HTML in the input form on the left</p></div>')).toBeTruthy();
      expect(validateHtml('<body><div><p>Paste your HTML in the input form on the left</p></div></body>')).toBeTruthy();
      expect(validateHtml('<p>Paste your HTML in the input form on the left</p>')).toBeTruthy();
      // An unclosed outer tag still counts as valid: the inner pair matches.
      expect(validateHtml('<div><p>Paste your HTML in the input form on the left</p>')).toBeTruthy();
    });

    it('check if the value is an html invalid', () => {
      expect(validateHtml('<p>Paste your HTML in the input form on the left<p>')).toBeFalsy();
      expect(validateHtml('Paste your HTML in the input form on the left<p>')).toBeFalsy();
      expect(validateHtml('<p>Paste your HTML in the input form on the left')).toBeFalsy();
      expect(validateHtml('<p>Paste your HTML in the input form on the left<>')).toBeFalsy();
      expect(validateHtml('<>Paste your HTML in the input form on the left<>')).toBeFalsy();
      expect(validateHtml('<p>Paste your HTML in the input form on the left</a>')).toBeFalsy();
    });
  });

  describe('getTextFromHtml', () => {
    it('must be return a string', () => {
      expect(typeof getTextFromHtml('<p>Paste your HTML in the input form on the left</p>')).toBe('string');
    });

    it('must be return text from html', () => {
      expect(getTextFromHtml('<p>Paste your HTML in the input form on the left</p>')).toStrictEqual(
        'Paste your HTML in the input form on the left',
      );
    });
  });
});
