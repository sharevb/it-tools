import type { CountryCode, NumberType } from 'libphonenumber-js/types';
import lookup from 'country-code-lookup';

export { formatTypeToHumanReadable, getFullCountryName, getDefaultCountryCode };

import { translate as t } from '@/plugins/i18n.plugin';

const typeToLabel: Record<NonNullable<NumberType>, string> = {
  MOBILE: t('tools.phone-parser-and-formatter.models.text.mobile'),
  FIXED_LINE: t('tools.phone-parser-and-formatter.models.text.fixed-line'),
  FIXED_LINE_OR_MOBILE: t('tools.phone-parser-and-formatter.models.text.fixed-line-or-mobile'),
  PERSONAL_NUMBER: t('tools.phone-parser-and-formatter.models.text.personal-number'),
  PREMIUM_RATE: t('tools.phone-parser-and-formatter.models.text.premium-rate'),
  SHARED_COST: t('tools.phone-parser-and-formatter.models.text.shared-cost'),
  TOLL_FREE: t('tools.phone-parser-and-formatter.models.text.toll-free'),
  UAN: t('tools.phone-parser-and-formatter.models.text.universal-access-number'),
  VOICEMAIL: t('tools.phone-parser-and-formatter.models.text.voicemail'),
  VOIP: 'VoIP',
  PAGER: t('tools.phone-parser-and-formatter.models.text.pager'),
};

function formatTypeToHumanReadable(type: NumberType): string | undefined {
  if (!type) {
    return undefined;
  }

  return typeToLabel[type];
}

function getFullCountryName(countryCode: string | undefined) {
  if (!countryCode) {
    return undefined;
  }

  return lookup.byIso(countryCode)?.country;
}

function getDefaultCountryCode({
  locale = window.navigator.language,
  defaultCode = 'FR',
}: { locale?: string; defaultCode?: CountryCode } = {}): CountryCode {
  const countryCode = locale.split('-')[1]?.toUpperCase();

  if (!countryCode) {
    return defaultCode;
  }

  return (lookup.byIso(countryCode)?.iso2 ?? defaultCode) as CountryCode;
}
