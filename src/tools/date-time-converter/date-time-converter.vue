<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  formatISO,
  formatISO9075,
  formatRFC3339,
  formatRFC7231,
  fromUnixTime,
  getTime,
  getUnixTime,
  isDate,
  isValid,
  parseISO,
} from 'date-fns';
import { ticksFromDate, ticksToDate } from 'tick-time';
import { UTCDate } from '@date-fns/utc';
import { formatInTimeZone } from 'date-fns-tz';
import { getAllTimezones } from 'countries-and-timezones';
import type { DateFormat, ToDateMapper } from './date-time-converter.types';
import {
  dateToExcelFormat,
  dateToLDAPTimestamp,
  dateToWin32FileTime,
  excelFormatToDate,
  fromJSDate,
  fromTimestamp,
  isExcelFormat,
  isISO8601DateTimeString,
  isISO9075DateString,
  isJSDate,
  isLDAPTimestamp,
  isMongoObjectId,
  isRFC3339DateString,
  isRFC7231DateString,
  isTimestamp,
  isUTCDateString,
  isUnixTimestamp,
  isWin32FileTime,
  lDAPTimestampToDate,
  toJSDate,
  win32FileTimeToUnix,
} from './date-time-converter.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const inputDate = useQueryParam({ tool: 'date-time-converter', name: 'date', defaultValue: '' });

const toDate: ToDateMapper = date => new Date(date);

const formats: DateFormat[] = [
  {
    name: 'JS locale date string',
    fromDate: date => date.toString(),
    toDate,
    formatMatcher: () => false,
  },
  {
    name: 'ISO 8601',
    fromDate: formatISO,
    toDate: parseISO,
    formatMatcher: date => isISO8601DateTimeString(date),
  },
  {
    name: 'ISO 8601 UTC',
    fromDate: date => (new UTCDate(date)).toISOString(),
    toDate: parseISO,
    formatMatcher: date => isISO8601DateTimeString(date),
  },
  {
    name: 'ISO 9075',
    fromDate: formatISO9075,
    toDate: parseISO,
    formatMatcher: date => isISO9075DateString(date),
  },
  {
    name: 'RFC 3339',
    fromDate: formatRFC3339,
    toDate,
    formatMatcher: date => isRFC3339DateString(date),
  },
  {
    name: 'RFC 7231',
    fromDate: formatRFC7231,
    toDate,
    formatMatcher: date => isRFC7231DateString(date),
  },
  {
    name: 'Unix timestamp',
    fromDate: date => String(getUnixTime(date)),
    toDate: sec => fromUnixTime(+sec),
    formatMatcher: date => isUnixTimestamp(date),
  },
  {
    name: 'Timestamp',
    fromDate: date => String(getTime(date)),
    toDate: ms => fromTimestamp(ms),
    formatMatcher: date => isTimestamp(date),
  },
  {
    name: 'UTC format',
    fromDate: date => date.toUTCString(),
    toDate,
    formatMatcher: date => isUTCDateString(date),
  },
  {
    name: 'Mongo ObjectID',
    fromDate: date => `${Math.floor(date.getTime() / 1000).toString(16)}0000000000000000`,
    toDate: objectId => new Date(Number.parseInt(objectId.substring(0, 8), 16) * 1000),
    formatMatcher: date => isMongoObjectId(date),
  },
  {
    name: 'Excel date/time',
    fromDate: date => dateToExcelFormat(date),
    toDate: excelFormatToDate,
    formatMatcher: isExcelFormat,
  },
  {
    name: 'JS Date',
    fromDate: date => toJSDate(date),
    toDate: date => fromJSDate(date),
    formatMatcher: isJSDate,
  },
  {
    name: 'LDAP YMD Timestamp',
    fromDate: date => dateToLDAPTimestamp(date),
    toDate: date => lDAPTimestampToDate(date),
    formatMatcher: isLDAPTimestamp,
  },
  {
    name: 'Win32 FileTime/LDAP 18 digits Timestamp',
    fromDate: date => dateToWin32FileTime(date),
    toDate: date => win32FileTimeToUnix(date),
    formatMatcher: isWin32FileTime,
  },
  {
    name: '.Net ticks',
    fromDate: date => ticksFromDate(date),
    toDate: date => ticksToDate(date) || new Date(),
    formatMatcher: date => /\d+/.test(date || ''),
  },
];

const formatIndex = ref(6);
const now = useNow();

// Timezone conversion functionality
const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const selectedTimezones = useStorage<{ name: string }[]>(
  'date-time-converter:timezones',
  [],
);

const allTimezones = computed(() => {
  return Object.values(getAllTimezones())
    .map(tz => ({
      value: tz.name,
      label: `${tz.name} (${tz.utcOffsetStr})`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

const normalizedDate = computed(() => {
  if (!inputDate.value) {
    return now.value;
  }

  const { toDate } = formats[formatIndex.value];

  try {
    return toDate(inputDate.value);
  }
  catch (_ignored) {
    return undefined;
  }
});

function onDateInputChanged(value: string) {
  const matchingIndex = formats.findIndex(({ formatMatcher }) => formatMatcher(value));
  if (matchingIndex !== -1) {
    formatIndex.value = matchingIndex;
  }
}

const validation = useValidation({
  source: inputDate,
  watch: [formatIndex],
  rules: [
    {
      message: t('tools.date-time-converter.texts.message-this-date-is-invalid-for-this-format'),
      validator: value =>
        withDefaultOnError(() => {
          if (value === '') {
            return true;
          }

          const maybeDate = formats[formatIndex.value].toDate(value);
          return isDate(maybeDate) && isValid(maybeDate);
        }, false),
    },
  ],
});

function formatDateUsingFormatter(formatter: (date: Date) => string, date?: Date) {
  if (!date || !validation.isValid) {
    return '';
  }

  return withDefaultOnError(() => formatter(date), '');
}

function formatDateInTimezone(date: Date | undefined, timezone: string): string {
  if (!date || !validation.isValid || !timezone) {
    return '';
  }

  return withDefaultOnError(() => {
    return formatInTimeZone(date, timezone, 'yyyy-MM-dd HH:mm:ss XXX');
  }, '');
}
</script>

<template>
  <div>
    <div flex gap-2>
      <c-input-text
        v-model:value="inputDate"
        autofocus
        :placeholder="t('tools.date-time-converter.texts.placeholder-put-your-date-string-here')"
        clearable
        test-id="date-time-converter-input"
        :validation="validation"
        @update:value="onDateInputChanged"
      />

      <c-select
        v-model:value="formatIndex"
        style="flex: 0 0 170px"
        :options="formats.map(({ name }, i) => ({ label: name, value: i }))"
        data-test-id="date-time-converter-format-select"
      />
    </div>

    <!-- Timezone conversion section -->
    <div v-if="selectedTimezones.length > 0" mb-4 mt-4>
      <n-dynamic-input
        v-model:value="selectedTimezones"
        show-sort-button
        :on-create="() => ({ name: browserTimezone })"
      >
        <template #default="{ value }">
          <div w-full flex items-center gap-2>
            <c-select
              v-model:value="value.name"
              searchable
              filterable
              :placeholder="t('tools.date-time-converter.texts.placeholder-select-timezone')"
              :options="allTimezones"
              style="flex: 0 0 350px"
            />

            <input-copyable
              :value="formatDateInTimezone(normalizedDate, value.name)"
              :placeholder="t('tools.date-time-converter.texts.placeholder-invalid-date')"
              readonly
              label-width="0"
              style="flex: 1; min-width: 0"
            />
          </div>
        </template>
      </n-dynamic-input>
    </div>

    <!-- Add timezone button (shown when list is empty) -->
    <div v-else mb-4 mt-4>
      <c-button
        size="small"
        @click="selectedTimezones.push({ name: browserTimezone })"
      >
        {{ t('tools.date-time-converter.texts.button-add-timezone') }}
      </c-button>
    </div>

    <n-divider />

    <input-copyable
      v-for="{ name, fromDate } in formats"
      :key="name"
      :label="name"
      label-width="150px"
      label-position="left"
      label-align="right"
      :value="formatDateUsingFormatter(fromDate, normalizedDate)"
      :placeholder="t('tools.date-time-converter.texts.placeholder-invalid-date')"
      :test-id="name"
      readonly
      mt-2
    />
  </div>
</template>
