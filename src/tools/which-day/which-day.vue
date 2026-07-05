<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const currentYear = new Date().getFullYear();

const day = useQueryParamOrStorage({ name: 'day', storageName: 'which-day:d', defaultValue: 1 });
const month = useQueryParamOrStorage({ name: 'month', storageName: 'which-day:m', defaultValue: 1 });
const startYear = useQueryParamOrStorage({ name: 'start', storageName: 'which-day:sy', defaultValue: 2000 });
const endYear = useQueryParamOrStorage({ name: 'end', storageName: 'which-day:ey', defaultValue: currentYear });
const error = ref('');

const columns = [
  { title: t('tools.which-day.text.year'), key: 'year', align: 'center' },
  { title: t('tools.which-day.text.weekday'), key: 'weekday', align: 'center' },
];

const results = computed(() => {
  const weekdays = [
    t('tools.which-day.text.sunday'),
    t('tools.which-day.text.monday'),
    t('tools.which-day.text.tuesday'),
    t('tools.which-day.text.wednesday'),
    t('tools.which-day.text.thursday'),
    t('tools.which-day.text.friday'),
    t('tools.which-day.text.saturday'),
  ];
  const output: Array<{ year: number; weekday: string }> = [];

  error.value = '';
  try {
    for (let year = startYear.value; year <= endYear.value; year++) {
      const date = new Date(year, month.value - 1, day.value);
      if (date && !Number.isNaN(date)) {
        output.push({
          year,
          weekday: weekdays[date.getDay()],
        });
      }
    }
  }
  catch (e: any) {
    error.value = e.toString();
  }

  return output;
});
</script>

<template>
  <div style="max-width: 700px">
    <NForm label-placement="left">
      <n-space justify="center">
        <NFormItem :label="t('tools.which-day.texts.label-day-in-month')">
          <NInputNumber v-model:value="day" :min="1" :max="31" />
        </NFormItem>
        <NFormItem :label="t('tools.which-day.texts.label-month')">
          <NInputNumber v-model:value="month" :min="1" :max="12" />
        </NFormItem>
      </n-space>
      <n-space justify="center">
        <NFormItem :label="t('tools.which-day.texts.label-start-year')">
          <NInputNumber v-model:value="startYear" />
        </NFormItem>
        <NFormItem :label="t('tools.which-day.texts.label-end-year')">
          <NInputNumber v-model:value="endYear" :min="startYear" />
        </NFormItem>
      </n-space>
    </NForm>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <n-data-table v-if="results.length" :columns="columns" :data="results" striped bordered />
  </div>
</template>
