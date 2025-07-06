<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { formatDuration, intervalToDuration } from 'date-fns';
import SpanCopyable from '@/components/SpanCopyable.vue';

const { t } = useI18n();

const days = ref(0);
const hours = ref(24);
const minutes = ref(0);
const seconds = ref(0);
const ttlDisplay = computed(() => (days.value * 86400 + hours.value * 3600 + minutes.value * 60 + seconds.value).toString());

const ttl = ref(0);
const timeDisplay = computed(() => formatDuration(intervalToDuration({ start: 0, end: ttl.value * 1000 })));
</script>

<template>
  <div>
    <c-card :title="t('tools.ttl-calculator.texts.title-time-to-ttl')" mb-3>
      <n-space>
        <n-form-item :label="t('tools.ttl-calculator.texts.label-days')">
          <n-input-number v-model:value="days" :min="0" />
        </n-form-item>
        <n-form-item :label="t('tools.ttl-calculator.texts.label-hours')">
          <n-input-number v-model:value="hours" :min="0" />
        </n-form-item>
        <n-form-item :label="t('tools.ttl-calculator.texts.label-minutes')">
          <n-input-number v-model:value="minutes" :min="0" />
        </n-form-item>
        <n-form-item :label="t('tools.ttl-calculator.texts.label-seconds')">
          <n-input-number v-model:value="seconds" :min="0" />
        </n-form-item>
      </n-space>

      <n-divider />

      <n-form-item :label="t('tools.ttl-calculator.texts.label-ttl')" label-placement="left">
        <SpanCopyable :value="ttlDisplay" />
      </n-form-item>
    </c-card>

    <c-card :title="t('tools.ttl-calculator.texts.title-ttl-to-time')">
      <n-form-item :label="t('tools.ttl-calculator.texts.label-ttl')">
        <n-input-number v-model:value="ttl" :min="0" />
      </n-form-item>

      <n-divider />

      <n-form-item :label="t('tools.ttl-calculator.texts.label-time')">
        <SpanCopyable :value="timeDisplay" />
      </n-form-item>
    </c-card>
  </div>
</template>
