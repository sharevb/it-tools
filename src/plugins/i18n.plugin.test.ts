import { describe, expect, it } from 'vitest';
import { readPersistedLocale, resolveLocale, resolveRequestedLocale } from './i18n.plugin';

function storageWith(value: string | null): Storage {
  return {
    getItem: () => value,
  } as Storage;
}

describe('readPersistedLocale', () => {
  it('reads a JSON-encoded locale from storage', () => {
    expect(readPersistedLocale(storageWith('"zh"'))).toBe('zh');
  });

  it('returns undefined for missing, invalid, or empty values', () => {
    expect(readPersistedLocale(storageWith(null))).toBeUndefined();
    expect(readPersistedLocale(storageWith('zh'))).toBeUndefined();
    expect(readPersistedLocale(storageWith('""'))).toBeUndefined();
    expect(readPersistedLocale(storageWith('{'))).toBeUndefined();
    expect(readPersistedLocale(null)).toBeUndefined();
  });
});

describe('resolveRequestedLocale', () => {
  it('prefers a persisted locale that the app ships', () => {
    expect(resolveRequestedLocale({ persisted: 'zh', configured: 'en' })).toBe('zh');
    expect(resolveRequestedLocale({ persisted: 'zh-CN', configured: 'en' })).toBe('zh');
  });

  it('uses the configured locale when persisted is missing or unknown', () => {
    expect(resolveRequestedLocale({ persisted: 'nope', configured: 'zh' })).toBe('zh');
    expect(resolveRequestedLocale({ configured: 'fr' })).toBe('fr');
    expect(resolveRequestedLocale({})).toBe('en');
  });
});

describe('resolveLocale', () => {
  it('maps BCP 47 tags onto shipped locales', () => {
    expect(resolveLocale('zh-CN')).toBe('zh');
    expect(resolveLocale('en-US')).toBe('en');
    expect(resolveLocale('nope')).toBe('en');
  });
});
