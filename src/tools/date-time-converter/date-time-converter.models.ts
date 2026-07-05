import _ from 'lodash';
import { addMilliseconds } from 'date-fns';
import Long from 'long';

export {
  isISO8601DateTimeString,
  isISO9075DateString,
  isRFC3339DateString,
  isRFC7231DateString,
  isUnixTimestamp,
  isTimestamp,
  isUTCDateString,
  isMongoObjectId,
  dateToExcelFormat,
  excelFormatToDate,
  isExcelFormat,
  fromTimestamp,
  isTimestampMicroSeconds,
  isJSDate,
  fromJSDate,
  toJSDate,
  isLDAPTimestamp,
  isWin32FileTime,
  win32FileTimeToUnix,
  dateToWin32FileTime,
  lDAPTimestampToDate,
  dateToLDAPTimestamp,
};

const ISO8601_REGEX
  = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
const ISO9075_REGEX
  = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,6})?(([+-])([0-9]{2}):([0-9]{2})|Z)?$/;

const RFC3339_REGEX
  = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,9})?(([+-])([0-9]{2}):([0-9]{2})|Z)$/;

const RFC7231_REGEX = /^[A-Za-z]{3},\s[0-9]{2}\s[A-Za-z]{3}\s[0-9]{4}\s[0-9]{2}:[0-9]{2}:[0-9]{2}\sGMT$/;

const EXCEL_FORMAT_REGEX = /^-?\d+(\.\d+)?$/;

const JS_DATE_REGEX = /^new\s+Date\(\s*(?:(\d+)\s*,\s*)(?:(\d|11)\s*,\s*(?:(\d+)\s*,\s*(?:(\d+)\s*,\s*(?:(\d+)\s*,\s*(?:(\d+)\s*,\s*)?)?)?)?)?(\d+)\)\s*;?$/;

const LDAP_TIMESTAMP_REGEX = /^([0-9]{4})(0[0-9]|1[012])([012][0-9]|3[01])([01][0-9]|2[0123])([0-5][0-9])([0-5][0-9])Z$/;

function createRegexMatcher(regex: RegExp) {
  return (date?: string) => !_.isNil(date) && regex.test(date);
}

const isISO8601DateTimeString = createRegexMatcher(ISO8601_REGEX);
const isISO9075DateString = createRegexMatcher(ISO9075_REGEX);
const isRFC3339DateString = createRegexMatcher(RFC3339_REGEX);
const isRFC7231DateString = createRegexMatcher(RFC7231_REGEX);
const isUnixTimestamp = createRegexMatcher(/^[0-9]{1,10}$/);
const isTimestamp = createRegexMatcher(/^([0-9]{1,13}|[0-9]{16})$/);
const isTimestampMilliSeconds = createRegexMatcher(/^[0-9]{1,13}$/);
const isTimestampMicroSeconds = createRegexMatcher(/^[0-9]{16}$/);
const isMongoObjectId = createRegexMatcher(/^[0-9a-fA-F]{24}$/);
const isLDAPTimestamp = createRegexMatcher(LDAP_TIMESTAMP_REGEX);
const isWin32FileTime = createRegexMatcher(/^[0-9]{18}$/);

const isJSDate = createRegexMatcher(JS_DATE_REGEX);
function fromJSDate(date: string): Date {
  const res = JS_DATE_REGEX.exec(date);
  const parts = (res || []).filter(p => p !== undefined).map(p => Number.parseInt(p, 10)).slice(1);
  return new (Function.prototype.bind.apply(Date, [null, ...parts]))();
}
const toJSDate = (date: Date) => `new Date(${date.getFullYear()}, ${date.getMonth()}, ${date.getDate()}, ${date.getHours()}, ${date.getMinutes()}, ${date.getSeconds()}, ${date.getMilliseconds()});`;

const isExcelFormat = createRegexMatcher(EXCEL_FORMAT_REGEX);

function isUTCDateString(date?: string) {
  if (_.isNil(date)) {
    return false;
  }

  try {
    return new Date(date).toUTCString() === date;
  }
  catch (_ignored) {
    return false;
  }
}

function dateToExcelFormat(date: Date) {
  return String(((date.getTime()) / (1000 * 60 * 60 * 24)) + 25569);
}

function excelFormatToDate(excelFormat: string | number) {
  return new Date((Number(excelFormat) - 25569) * 86400 * 1000);
}

function fromTimestamp(timestamp: string, type: 'auto' | 'milliseconds' | 'microseconds' = 'auto') {
  let milliSeconds = 0;
  if (type === 'microseconds' || isTimestampMicroSeconds(timestamp)) {
    milliSeconds = Number(timestamp) / 1000;
  }
  else if (type === 'milliseconds' || isTimestampMilliSeconds(timestamp)) {
    milliSeconds = Number(timestamp);
  }
  return addMilliseconds(new Date(0), milliSeconds);
}

function win32FileTimeToUnix(ft: string) {
  const ulong = Long.fromString(ft, true, 10).div(10000);
  let epochBase = ulong.sub(11644473600000);

  if (epochBase.greaterThan(ulong)) {
    epochBase = epochBase.toSigned();
  }

  return new Date(epochBase.toNumber());
}

function dateToWin32FileTime(date: Date) {
  const timestamp = +date;
  const long = Long
    .fromNumber(timestamp, timestamp >= 0)
    .add(11644473600000)
    .mul(10000);

  return long.toString(10);
}

function lDAPTimestampToDate(ldapTimestamp: string) {
  const [, yy, mm, dd, hh, nn, ss] = LDAP_TIMESTAMP_REGEX.exec(ldapTimestamp) || [];
  if (!yy || !mm) {
    return new Date();
  }
  return new Date(
    Number.parseInt(yy, 10),
    Number.parseInt(mm, 10) - 1,
    Number.parseInt(dd, 10),
    Number.parseInt(hh, 10),
    Number.parseInt(nn, 10),
    Number.parseInt(ss, 10));
}

function dateToLDAPTimestamp(date: Date) {
  const pad2 = (n: number) => n.toString().padStart(2, '0');
  return `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`;
}
