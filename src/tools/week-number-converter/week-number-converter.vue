<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getISOWeek, getWeek, getWeekOfMonth } from 'date-fns';
import { getFirstMondayFromISOWeek, getFirstMondayFromMonthWeek } from './week-number-converter.service';
import { useQueryParam } from '@/composable/queryParams';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const now = new Date();

function toISODateString(d: Date) {
  return d.toISOString().substring(0, 10);
}

const inputDateString = useQueryParam({ tool: 'week-num-conv', name: 'date', defaultValue: toISODateString(now) });
const inputDate = computed({
  get() { return withDefaultOnError(() => new Date(inputDateString.value).getTime(), now.getTime()); },
  set(newDate) { inputDateString.value = toISODateString(new Date(newDate)); },
});
const outputWeekInMonth = computed(() => getWeekOfMonth(inputDate.value));
const outputLocalWeekInYear = computed(() => getWeek(inputDate.value));
const outputISOWeekInYear = computed(() => getISOWeek(inputDate.value));

const inputWeekInMonth = ref({
  week: getWeekOfMonth(now),
  month: now.getMonth() + 1,
  year: now.getFullYear(),
});
const outputWeekInMonthMonday = computed(() => getFirstMondayFromMonthWeek(inputWeekInMonth.value.week, inputWeekInMonth.value.month, inputWeekInMonth.value.year));

const inputWeekInYear = ref({
  week: getWeek(now),
  year: now.getFullYear(),
});
const outputWeekInYearMonday = computed(() => getFirstMondayFromISOWeek(inputWeekInYear.value.week, inputWeekInYear.value.year));
</script>

<template>
  <div>
    <c-card :title="t('tools.week-number-converter.texts.title-date-to-week-numbers')" mb-2>
      <n-form-item :label="t('tools.week-number-converter.texts.label-date')" label-placement="left">
        <n-date-picker v-model:value="inputDate" type="date" />
      </n-form-item>

      <n-divider />

      <input-copyable readonly :label="t('tools.week-number-converter.texts.label-local-week-in-year')" label-position="left" label-width="130px" :value="outputLocalWeekInYear" mb-1 />
      <input-copyable readonly :label="t('tools.week-number-converter.texts.label-iso-week-in-year')" label-position="left" label-width="130px" :value="outputISOWeekInYear" mb-1 />
      <input-copyable readonly :label="t('tools.week-number-converter.texts.label-week-in-month')" label-position="left" label-width="130px" :value="outputWeekInMonth" mb-1 />
    </c-card>
    <c-card :title="t('tools.week-number-converter.texts.title-iso-week-number-to-date')" mb-2>
      <div flex items-baseline gap-2>
        <n-form-item :label="t('tools.week-number-converter.texts.label-iso-week-number')" label-placement="left" flex-1>
          <n-input-number-i18n v-model:value="inputWeekInYear.week" :min="1" :max="53" />
        </n-form-item>
        <n-form-item :label="t('tools.week-number-converter.texts.label-year')" label-placement="left" flex-1>
          <n-input-number-i18n v-model:value="inputWeekInYear.year" />
        </n-form-item>
      </div>

      <n-divider />

      <input-copyable readonly :label="t('tools.week-number-converter.texts.label-first-monday')" label-position="left" :value="outputWeekInYearMonday" />
    </c-card>
    <c-card :title="t('tools.week-number-converter.texts.title-week-number-in-month-to-date')" mb-2>
      <div flex items-baseline gap-2>
        <n-form-item :label="t('tools.week-number-converter.texts.label-week-in-month')" label-placement="left" flex-1>
          <n-input-number-i18n v-model:value="inputWeekInMonth.week" :min="1" :max="5" />
        </n-form-item>
        <n-form-item :label="t('tools.week-number-converter.texts.label-month')" label-placement="left" flex-1>
          <n-input-number-i18n v-model:value="inputWeekInMonth.month" :min="1" :max="12" />
        </n-form-item>
        <n-form-item :label="t('tools.week-number-converter.texts.label-year')" label-placement="left" flex-1>
          <n-input-number-i18n v-model:value="inputWeekInMonth.year" />
        </n-form-item>
      </div>

      <n-divider />

      <input-copyable readonly :label="t('tools.week-number-converter.texts.label-first-monday')" label-position="left" :value="outputWeekInMonthMonday" />
    </c-card>
  </div>
</template>
