<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  computeIsWhatPercentOf,
  computePercentageIncreaseDecrease,
  computePercentageOf,
} from './percentage-calculator.service';

const { t } = useI18n();

const percentageX = ref();
const percentageY = ref();
const percentageResult = computed(() => computePercentageOf(percentageX.value, percentageY.value));

const numberX = ref();
const numberY = ref();
const numberResult = computed(() => computeIsWhatPercentOf(numberX.value, numberY.value));

const numberFrom = ref();
const numberTo = ref();
const percentageIncreaseDecrease = computed(() => computePercentageIncreaseDecrease(numberFrom.value, numberTo.value));
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px">
      <c-card mb-3>
        <div mb-3 sm:hidden>
          {{ t('tools.percentage-calculator.texts.tag-what-is') }}
        </div>
        <div flex gap-2>
          <div hidden pt-1 sm:block style="min-width: 48px">
            {{ t('tools.percentage-calculator.texts.tag-what-is') }}
          </div>
          <n-input-number-i18n
            v-model:value="percentageX"
            data-test-id="percentageX"
            :placeholder="t('tools.percentage-calculator.texts.placeholder-x')"
          />
          <div min-w-fit pt-1>
            {{ t('tools.percentage-calculator.texts.tag-of') }}
          </div>
          <n-input-number-i18n
            v-model:value="percentageY"
            data-test-id="percentageY"
            :placeholder="t('tools.percentage-calculator.texts.placeholder-y')"
          />
          <input-copyable
            v-model:value="percentageResult"
            data-test-id="percentageResult"
            readonly
            :placeholder="t('tools.percentage-calculator.texts.placeholder-result')"
            style="max-width: 150px"
          />
        </div>
      </c-card>

      <c-card mb-3>
        <div mb-3 sm:hidden>
          {{ t('tools.percentage-calculator.texts.tag-x-is-what-percent-of-y') }}
        </div>
        <div flex gap-2>
          <n-input-number-i18n
            v-model:value="numberX"
            data-test-id="numberX"
            :placeholder="t('tools.percentage-calculator.texts.placeholder-x')"
          />
          <div hidden min-w-fit pt-1 sm:block>
            {{ t('tools.percentage-calculator.texts.tag-is-what-percent-of') }}
          </div>
          <n-input-number-i18n
            v-model:value="numberY"
            data-test-id="numberY"
            :placeholder="t('tools.percentage-calculator.texts.placeholder-y')"
          />
          <input-copyable
            v-model:value="numberResult"
            data-test-id="numberResult"
            readonly
            :placeholder="t('tools.percentage-calculator.texts.placeholder-result')"
            style="max-width: 150px"
          />
        </div>
      </c-card>

      <c-card mb-3>
        <div mb-3>
          {{ t('tools.percentage-calculator.texts.tag-what-is-the-percentage-increase-decrease') }}
        </div>
        <div flex gap-2>
          <n-input-number-i18n
            v-model:value="numberFrom"
            data-test-id="numberFrom"
            :placeholder="t('tools.percentage-calculator.texts.placeholder-from')"
          />
          <n-input-number-i18n
            v-model:value="numberTo"
            data-test-id="numberTo"
            :placeholder="t('tools.percentage-calculator.texts.placeholder-to')"
          />
          <input-copyable
            v-model:value="percentageIncreaseDecrease"
            data-test-id="percentageIncreaseDecrease"
            readonly
            :placeholder="t('tools.percentage-calculator.texts.placeholder-result')"
            style="max-width: 150px"
          />
        </div>
      </c-card>
    </div>
  </div>
</template>
