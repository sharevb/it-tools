<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { addToDate } from './date-duration-calculator.service';

const { t } = useI18n();

const now = Date.now();

const inputReferenceDate = ref(now);
const inputDurations = ref('');
const resultDateAdder = computed(() => addToDate(new Date(inputReferenceDate.value), inputDurations.value));
const errorsDateAdder = computed(() => resultDateAdder.value.errors.join('\n'));
</script>

<template>
  <div>
    <c-card :title="t('tools.date-duration-calculator.texts.title-date-duration-calculator')" mb-2>
      <n-form-item :label="t('tools.date-duration-calculator.texts.label-reference-date')" label-placement="left" mb-1>
        <n-date-picker v-model:value="inputReferenceDate" type="datetime" />
      </n-form-item>

      <c-input-text
        v-model:value="inputDurations"
        multiline
        rows="5"
        :label="t('tools.date-duration-calculator.texts.label-duration-s')"
        :placeholder="t('tools.date-duration-calculator.texts.placeholder-please-enter-duration-one-per-line-with-optional-sign')"
        mb-2
      />
      <n-p>{{ t('tools.date-duration-calculator.texts.tag-supports-comment-line-hh-mm-ss-fff-3d-1h-3s-p4dt12h20m20-3s') }}</n-p>

      <c-card v-if="errorsDateAdder" :title="t('tools.date-duration-calculator.texts.title-lines-errors')">
        <textarea-copyable :value="errorsDateAdder" />
      </c-card>

      <n-divider />

      <input-copyable v-if="resultDateAdder" :label="t('tools.date-duration-calculator.texts.label-result-date')" label-position="left" label-width="150px" :value="resultDateAdder.date.toString()" mb-1 />
      <input-copyable v-if="resultDateAdder" :label="t('tools.date-duration-calculator.texts.label-result-iso-date')" label-position="left" label-width="150px" :value="resultDateAdder.date.toISOString()" mb-1 />
      <input-copyable v-if="resultDateAdder" :label="t('tools.date-duration-calculator.texts.label-duration-seconds')" label-position="left" label-width="150px" :value="resultDateAdder.durationSeconds" mb-1 />
      <input-copyable v-if="resultDateAdder" :label="t('tools.date-duration-calculator.texts.label-duration')" label-position="left" label-width="150px" :value="resultDateAdder.durationPretty" mb-1 />
    </c-card>
  </div>
</template>
