import { getAllTimezones, getTimezone } from 'countries-and-timezones';

interface TimezoneInfo {
  name: string
  utcOffsetStr: string
  dstOffsetStr: string
}

const timezones = getAllTimezones() as Record<string, TimezoneInfo>;

function getCanonicalSelectableTimeZone(timezone?: string) {
  const canonicalTimeZone = getTimezone(timezone ?? '')?.aliasOf ?? timezone;
  return isAllowedTimeZone(canonicalTimeZone) ? canonicalTimeZone : undefined;
}

export function isAllowedTimeZone(timezone?: string) {
  return typeof timezone === 'string' && !!timezones[timezone];
}

export function resolveIanaTimeZone(timezone?: string, fallback = 'Etc/UTC') {
  if (!timezone) {
    return fallback;
  }

  try {
    const formatter = new Intl.DateTimeFormat(undefined, { timeZone: timezone });
    const resolvedTimezone = formatter.resolvedOptions().timeZone;

    if (isAllowedTimeZone(timezone)) {
      return timezone;
    }

    if (isAllowedTimeZone(resolvedTimezone)) {
      return resolvedTimezone;
    }

    return fallback;
  }
  catch (_ignored) {
    return fallback;
  }
}

export function resolveBrowserTimeZone(timezone?: string, fallback = 'Etc/UTC') {
  if (!timezone) {
    return fallback;
  }

  try {
    const formatter = new Intl.DateTimeFormat(undefined, { timeZone: timezone });
    const resolvedTimezone = formatter.resolvedOptions().timeZone;

    for (const candidate of [timezone, resolvedTimezone]) {
      const canonicalTimeZone = getCanonicalSelectableTimeZone(candidate);
      if (canonicalTimeZone) {
        return canonicalTimeZone;
      }
    }

    return fallback;
  }
  catch (_ignored) {
    return fallback;
  }
}

export function getBrowserTimeZone() {
  return resolveBrowserTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
}

export function getTimeZoneOptionLabel({
  browserTimezone,
  dstOffsetStr,
  name,
  utcOffsetStr,
}: {
  browserTimezone: string
  dstOffsetStr: string
  name: string
  utcOffsetStr: string
}) {
  const browserPrefix = name === browserTimezone ? 'Browser TZ - ' : '';
  const offsetLabel = utcOffsetStr === dstOffsetStr ? utcOffsetStr : `${utcOffsetStr}/${dstOffsetStr}`;

  return `${browserPrefix}${name} (${offsetLabel})`;
}

export function getIanaTimeZoneOptions(browserTimezone = getBrowserTimeZone()) {
  return Object.values(timezones)
    .map(tz => ({
      value: tz.name,
      label: getTimeZoneOptionLabel({
        browserTimezone,
        dstOffsetStr: tz.dstOffsetStr,
        name: tz.name,
        utcOffsetStr: tz.utcOffsetStr,
      }),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
