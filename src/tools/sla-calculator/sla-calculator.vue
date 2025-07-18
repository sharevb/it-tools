<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import prettyMilliseconds from 'pretty-ms';
import parse from 'parse-duration';
import { downTimeToSLA, slaToDowntimes } from './sla-calculator.service';
import { useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

function prettySeconds(seconds: number | null) {
  if (!seconds) {
    return '';
  }
  return prettyMilliseconds(seconds * 1000);
}

const daysHours = useQueryParamOrStorage<{
  mon?: number
  tue?: number
  wed?: number
  thu?: number
  fri?: number
  sat?: number
  sun?: number
}>({
  name: 'days',
  storageName: 'sla:days',
  defaultValue: {
    mon: 24,
    tue: 24,
    wed: 24,
    thu: 24,
    fri: 24,
    sat: 24,
    sun: 24,
  },
});
const inputSLA = useQueryParam({ name: 'sla', defaultValue: 99.99 });
const outputDownTimes = computed(() => {
  const weekdaysHours = daysHours.value;
  const downtimesSeconds = slaToDowntimes({
    targetSLA: inputSLA.value,
    mondayHours: weekdaysHours.mon,
    tuesdayHours: weekdaysHours.tue,
    wednesdayHours: weekdaysHours.wed,
    thursdayHours: weekdaysHours.thu,
    fridayHours: weekdaysHours.fri,
    saturdayHours: weekdaysHours.sat,
    sundayHours: weekdaysHours.sun,
  });
  return {
    durationPerDay: prettySeconds(downtimesSeconds.secondsPerDay),
    durationPerMonth: prettySeconds(downtimesSeconds.secondsPerMonth),
    durationPerQuarter: prettySeconds(downtimesSeconds.secondsPerQuarter),
    durationPerWeek: prettySeconds(downtimesSeconds.secondsPerWeek),
    durationPerYear: prettySeconds(downtimesSeconds.secondsPerYear),
  };
});

const inputDuration = useQueryParam({ name: 'dur', defaultValue: '1s' });
const inputDurationValidation = useValidation({
  source: inputDuration,
  rules: [
    {
      message: t('tools.sla-calculator.texts.message-invalid-duration'),
      validator: value => parse(value),
    },
  ],
});
const inputDurationSeconds = computed(() => {
  if (!inputDurationValidation.isValid) {
    return 0;
  }
  return parse(inputDuration.value, 's') || 0;
});
const outputSLAs = computed(() => {
  const weekdaysHours = daysHours.value;
  const slas = downTimeToSLA({
    downTimeSeconds: inputDurationSeconds.value,
    mondayHours: weekdaysHours.mon,
    tuesdayHours: weekdaysHours.tue,
    wednesdayHours: weekdaysHours.wed,
    thursdayHours: weekdaysHours.thu,
    fridayHours: weekdaysHours.fri,
    saturdayHours: weekdaysHours.sat,
    sundayHours: weekdaysHours.sun,
  });
  return {
    slaForDay: slas.slaForDay?.toPrecision(6),
    slaForWeek: slas.slaForWeek.toPrecision(6),
    slaForMonth: slas.slaForMonth.toPrecision(6),
    slaForQuarter: slas.slaForQuarter.toPrecision(6),
    slaForYear: slas.slaForYear.toPrecision(6),
  };
});
</script>

<template>
  <div>
    <c-card :title="t('tools.sla-calculator.texts.title-sla-to-downtimes')" mb-2>
      <n-form-item :label="t('tools.sla-calculator.texts.label-agreed-sla')" label-placement="left">
        <n-input-number v-model:value="inputSLA" :min="0" :max="100" />
      </n-form-item>

      <n-divider />

      <n-form-item v-if="outputDownTimes.durationPerDay" :label="t('tools.sla-calculator.texts.label-daily-downtime')" label-placement="left" label-width="100">
        <input-copyable :value="outputDownTimes.durationPerDay" />
      </n-form-item>
      <n-form-item :label="t('tools.sla-calculator.texts.label-weekly-downtime')" label-placement="left" label-width="100">
        <input-copyable :value="outputDownTimes.durationPerWeek" />
      </n-form-item>
      <n-form-item :label="t('tools.sla-calculator.texts.label-monthly-downtime')" label-placement="left" label-width="100">
        <input-copyable :value="outputDownTimes.durationPerMonth" />
      </n-form-item>
      <n-form-item :label="t('tools.sla-calculator.texts.label-quarterly-downtime')" label-placement="left" label-width="100">
        <input-copyable :value="outputDownTimes.durationPerQuarter" />
      </n-form-item>
      <n-form-item :label="t('tools.sla-calculator.texts.label-yearly-downtime')" label-placement="left" label-width="100">
        <input-copyable :value="outputDownTimes.durationPerYear" />
      </n-form-item>
    </c-card>

    <c-card :title="t('tools.sla-calculator.texts.title-downtime-to-sla')" mb-2>
      <c-input-text
        v-model:value="inputDuration"
        :label="t('tools.sla-calculator.texts.label-downtime-duration')"
        label-position="left"
        :placeholder="t('tools.sla-calculator.texts.placeholder-put-downtime-duration-here')"
        :validation="inputDurationValidation"
        mb-2
      />

      <n-divider />

      <n-form-item v-if="outputSLAs.slaForDay" :label="t('tools.sla-calculator.texts.label-daily-sla')" label-placement="left" label-width="100">
        <input-copyable :value="outputSLAs.slaForDay" />
      </n-form-item>
      <n-form-item :label="t('tools.sla-calculator.texts.label-weekly-sla')" label-placement="left" label-width="100">
        <input-copyable :value="outputSLAs.slaForWeek" />
      </n-form-item>
      <n-form-item :label="t('tools.sla-calculator.texts.label-monthly-sla')" label-placement="left" label-width="100">
        <input-copyable :value="outputSLAs.slaForMonth" />
      </n-form-item>
      <n-form-item :label="t('tools.sla-calculator.texts.label-quarterly-sla')" label-placement="left" label-width="100">
        <input-copyable :value="outputSLAs.slaForQuarter" />
      </n-form-item>
      <n-form-item :label="t('tools.sla-calculator.texts.label-yearly-sla')" label-placement="left" label-width="100">
        <input-copyable :value="outputSLAs.slaForYear" />
      </n-form-item>
    </c-card>

    <c-card :title="t('tools.sla-calculator.texts.title-weekdays-hours')">
      <div flex flex-wrap gap-1>
        <n-form-item :label="t('tools.sla-calculator.texts.label-monday')" flex-1>
          <n-input-number v-model:value="daysHours.mon" :min="0" :max="24" />
        </n-form-item>
        <n-form-item :label="t('tools.sla-calculator.texts.label-tuesday')" flex-1>
          <n-input-number v-model:value="daysHours.tue" :min="0" :max="24" />
        </n-form-item>
        <n-form-item :label="t('tools.sla-calculator.texts.label-wednesday')" flex-1>
          <n-input-number v-model:value="daysHours.wed" :min="0" :max="24" />
        </n-form-item>
        <n-form-item :label="t('tools.sla-calculator.texts.label-thursday')" flex-1>
          <n-input-number v-model:value="daysHours.thu" :min="0" :max="24" />
        </n-form-item>
        <n-form-item :label="t('tools.sla-calculator.texts.label-friday')" flex-1>
          <n-input-number v-model:value="daysHours.fri" :min="0" :max="24" />
        </n-form-item>
      </div>
      <div flex flex-wrap gap-1>
        <n-form-item :label="t('tools.sla-calculator.texts.label-saturday')" flex-1>
          <n-input-number v-model:value="daysHours.sat" :min="0" :max="24" />
        </n-form-item>
        <n-form-item :label="t('tools.sla-calculator.texts.label-sunday')" flex-1>
          <n-input-number v-model:value="daysHours.sun" :min="0" :max="24" />
        </n-form-item>
      </div>
    </c-card>
  </div>
</template>
