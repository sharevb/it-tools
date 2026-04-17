import { describe, expect, it } from 'vitest';
import { convertJsonToEnv } from './json-to-env.service';

describe('json-to-env service', () => {
  describe('convertJsonToEnv', () => {
    it('converts a flat JSON object to .env lines', () => {
      const json = JSON.stringify({
        ACCESS_KEY: 'mySecretAccessKey',
        APP_ENV: 'prod',
      });

      expect(convertJsonToEnv({ json })).toMatchInlineSnapshot(`
        "ACCESS_KEY=mySecretAccessKey
        APP_ENV=prod"
      `);
    });

    it('uppercases keys by default', () => {
      expect(convertJsonToEnv({ json: '{"app_env": "prod"}' })).toBe('APP_ENV=prod');
    });

    it('keeps original case when uppercaseKeys is false', () => {
      expect(convertJsonToEnv({ json: '{"appEnv": "prod"}', uppercaseKeys: false })).toBe('appEnv=prod');
    });

    it('quotes values that contain spaces', () => {
      expect(convertJsonToEnv({ json: '{"greeting": "hello world"}' })).toBe('GREETING="hello world"');
    });

    it('quotes values that contain double quotes and escapes them', () => {
      expect(convertJsonToEnv({ json: '{"q": "he said \\"hi\\""}' })).toBe('Q="he said \\"hi\\""');
    });

    it('quotes values that contain # so they are not read as comments', () => {
      expect(convertJsonToEnv({ json: '{"color": "#ff0000"}' })).toBe('COLOR="#ff0000"');
    });

    it('quotes empty string values', () => {
      expect(convertJsonToEnv({ json: '{"empty": ""}' })).toBe('EMPTY=""');
    });

    it('converts null and undefined to empty values', () => {
      expect(convertJsonToEnv({ json: '{"a": null}' })).toBe('A=""');
    });

    it('stringifies numbers and booleans', () => {
      expect(convertJsonToEnv({ json: '{"port": 8080, "debug": true}' })).toMatchInlineSnapshot(`
        "PORT=8080
        DEBUG=true"
      `);
    });

    it('serializes nested objects and arrays as JSON strings', () => {
      const result = convertJsonToEnv({ json: '{"list": [1, 2, 3], "obj": {"a": 1}}' });
      expect(result).toMatchInlineSnapshot(`
        "LIST=\\"[1,2,3]\\"
        OBJ=\\"{\\\\\\"a\\\\\\":1}\\""
      `);
    });

    it('escapes newlines in values', () => {
      expect(convertJsonToEnv({ json: '{"multi": "line1\\nline2"}' })).toBe('MULTI="line1\\nline2"');
    });

    it('returns empty string on empty input', () => {
      expect(convertJsonToEnv({ json: '' })).toBe('');
      expect(convertJsonToEnv({ json: '   ' })).toBe('');
    });

    it('throws when JSON is an array', () => {
      expect(() => convertJsonToEnv({ json: '[1, 2, 3]' })).toThrow();
    });

    it('throws when JSON is a primitive', () => {
      expect(() => convertJsonToEnv({ json: '"just a string"' })).toThrow();
    });

    it('throws on invalid JSON', () => {
      expect(() => convertJsonToEnv({ json: '{not json}' })).toThrow();
    });
  });
});
