import { describe, expect, it } from 'vitest';
import { resolveAppBaseUrl } from './base-url';

describe('base-url utils', () => {
  describe('resolveAppBaseUrl', () => {
    it('falls back to the root when there is no <base href>', () => {
      expect(resolveAppBaseUrl(undefined, 'https://example.com/base64-string-converter')).to.eql('/');
      expect(resolveAppBaseUrl(null, 'https://example.com/base64-string-converter')).to.eql('/');
      expect(resolveAppBaseUrl('', 'https://example.com/base64-string-converter')).to.eql('/');
    });

    it('reads the subpath the container injected, whatever the current route is', () => {
      expect(resolveAppBaseUrl('/it-tools/', 'https://example.com/it-tools/base64-string-converter')).to.eql(
        '/it-tools/',
      );
      expect(resolveAppBaseUrl('/some/nested/path/', 'https://example.com/some/nested/path/uuid-generator')).to.eql(
        '/some/nested/path/',
      );
    });

    it('always ends on a slash, so `${base}file.json` stays a sibling of index.html', () => {
      expect(resolveAppBaseUrl('/it-tools', 'https://example.com/it-tools')).to.eql('/it-tools/');
      expect(resolveAppBaseUrl('/', 'https://example.com/')).to.eql('/');
    });

    it('accepts an absolute <base href>, keeping only its path', () => {
      expect(resolveAppBaseUrl('https://tools.example.com/it-tools/', 'https://tools.example.com/it-tools/')).to.eql(
        '/it-tools/',
      );
    });

    it('resolves a relative <base href> against the page, not against itself', () => {
      expect(resolveAppBaseUrl('./', 'https://example.com/it-tools/')).to.eql('/it-tools/');
    });

    it('falls back to the root rather than throwing on a href that is not a URL', () => {
      expect(resolveAppBaseUrl('http://', 'https://example.com/')).to.eql('/');
    });
  });
});
