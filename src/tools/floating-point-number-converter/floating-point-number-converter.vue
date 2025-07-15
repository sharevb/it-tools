<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import InputCopyable from '../../components/InputCopyable.vue';
import { convertBase } from '../integer-base-converter/integer-base-converter.model';
import { calcErrorDueToConversion, convertBinaryToDecimal, convertDecimalToBinary } from './floating-point-number-converter.model';
import { getErrorMessageIfThrows } from '@/utils/error';

const { t } = useI18n();

const bitCount = ref(32);
const decimalInput = ref('42.42');
const binaryOutput = ref();
const actualValue = ref();

const binaryInput = ref('01000010001010011010111000010100');
const decimalPrecision = ref('32');
const showTrailingZeros = ref(false);

function errorlessBinaryToDecimalConversion(...args: Parameters<typeof convertBinaryToDecimal>) {
  try {
    return convertBinaryToDecimal(...args);
  }
  catch (err) {
    return '';
  }
}

const binaryToDecimalError = computed(() =>
  getErrorMessageIfThrows(() =>
    convertBinaryToDecimal({ value: binaryInput.value, decimalPrecision: decimalPrecision.value, removeZeroPadding: false }),
  ),
);
</script>

<template>
  <c-card :title="t('tools.floating-point-number-converter.texts.title-decimal-to-binary')" style="min-width: 650px">
    <c-input-text
      v-model:value="decimalInput"
      :label="t('tools.floating-point-number-converter.texts.label-decimal-number')"
      :placeholder="t('tools.floating-point-number-converter.texts.placeholder-put-your-decimal-number-here-ex-42-42')"
      label-position="left"
      label-width="210px"
      label-align="right"
      mb-2
    />

    <c-select
      v-model:value="bitCount"
      mb-4
      :label="t('tools.floating-point-number-converter.texts.label-bit-count')"
      label-position="left"
      label-width="210px"
      label-align="right"
      :options="[
        {
          label: t('tools.floating-point-number-converter.texts.label-32-bit-single-precision'),
          value: 32,
        },
        {
          label: t('tools.floating-point-number-converter.texts.label-64-bit-double-precision'),
          value: 64,
        },
      ]"
    />

    <n-divider />

    <InputCopyable
      :label="t('tools.floating-point-number-converter.texts.label-binary-number')"
      :placeholder="t('tools.floating-point-number-converter.texts.placeholder-binary-number')"
      :value="binaryOutput = convertDecimalToBinary({ value: decimalInput, bitCount })"
      readonly
      label-position="left"
      label-width="210px"
      label-align="right"
      mb-2
    />

    <InputCopyable
      :label="t('tools.floating-point-number-converter.texts.label-hexadecimal-representation')"
      :placeholder="t('tools.floating-point-number-converter.texts.placeholder-hexadecimal-representation')"
      :value="convertBase({ value: binaryOutput, fromBase: 2, toBase: 16 })"
      readonly
      label-position="left"
      label-width="210px"
      label-align="right"
      mb-2
    />

    <InputCopyable
      :label="t('tools.floating-point-number-converter.texts.label-actually-stored-value')"
      :placeholder="t('tools.floating-point-number-converter.texts.placeholder-actually-stored-value')"
      :value="actualValue = errorlessBinaryToDecimalConversion({ value: binaryOutput, decimalPrecision: '32', removeZeroPadding: true })"
      readonly
      label-position="left"
      label-width="210px"
      label-align="right"
      mb-2
    />

    <InputCopyable
      :label="t('tools.floating-point-number-converter.texts.label-error-due-to-conversion')"
      :placeholder="t('tools.floating-point-number-converter.texts.placeholder-error-due-to-conversion')"
      :value="calcErrorDueToConversion({ decimalInput, actualValue })"
      readonly
      label-position="left"
      label-width="210px"
      label-align="right"
      mb-2
    />
  </c-card>

  <c-card :title="t('tools.floating-point-number-converter.texts.title-binary-to-decimal')" style="min-width: 650px">
    <c-input-text
      v-model:value="binaryInput"
      :label="t('tools.floating-point-number-converter.texts.label-binary-number')"
      :placeholder="t('tools.floating-point-number-converter.texts.placeholder-put-your-binary-number-here-ex-01000010001010011010111000010100')"
      label-position="left"
      label-width="140px"
      label-align="right"
      mb-2
    />

    <c-input-text
      v-model:value="decimalPrecision"
      :label="t('tools.floating-point-number-converter.texts.label-decimal-precision')"
      :placeholder="t('tools.floating-point-number-converter.texts.placeholder-choose-the-decimal-precision-digits-after-the-decimal-point')"
      label-position="left"
      label-width="140px"
      label-align="right"
      mb-2
    />

    <n-form-item
      :label="t('tools.floating-point-number-converter.texts.label-show-trailing-zeros')"
      label-placement="left"
      label-width="140px"
      label-align="right"
    >
      <n-switch
        v-model:value="showTrailingZeros"
      />
    </n-form-item>

    <n-alert v-if="binaryToDecimalError" style="margin-top: 25px" type="error">
      {{ binaryToDecimalError }}
    </n-alert>

    <n-divider />

    <InputCopyable
      :label="t('tools.floating-point-number-converter.texts.label-decimal-number')"
      :placeholder="t('tools.floating-point-number-converter.texts.placeholder-decimal-number')"
      :value="errorlessBinaryToDecimalConversion({ value: binaryInput, decimalPrecision, removeZeroPadding: !showTrailingZeros })"
      readonly
      label-position="left"
      label-width="140px"
      label-align="right"
      mb-2
    />
  </c-card>
</template>
