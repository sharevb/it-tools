<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  noCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase,
} from 'change-case';
import InputCopyable from '../../components/InputCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const cleaningRegex = useQueryParamOrStorage({ name: 'clean', storageName: 'case-conv:cl', defaultValue: '[^\\w\\d\\s]' });
const cleaningRegexValidation = useValidation({
  source: cleaningRegex,
  rules: [
    {
      message: t('tools.case-converter.texts.message-invalid-cleaning-regex-0'),
      validator: value => new RegExp(value),
      getErrorMessage: (value) => {
        const _ = new RegExp(value);
        return '';
      },
    },
  ],
});

const input = ref('lorem ipsum dolor sit amet');
const inputCleaned = computed(() => {
  if (!cleaningRegexValidation.isValid) {
    return input.value;
  }
  return input.value.replace(new RegExp(cleaningRegex.value, 'g'), '');
});

const formats = computed(() => [
  {
    label: t('tools.case-converter.texts.label-lowercase'),
    value: inputCleaned.value.toLocaleLowerCase(),
  },
  {
    label: t('tools.case-converter.texts.label-uppercase'),
    value: inputCleaned.value.toLocaleUpperCase(),
  },
  {
    label: t('tools.case-converter.texts.label-camelcase'),
    value: camelCase(inputCleaned.value),
  },
  {
    label: t('tools.case-converter.texts.label-capitalcase'),
    value: capitalCase(inputCleaned.value),
  },
  {
    label: t('tools.case-converter.texts.label-constantcase'),
    value: constantCase(inputCleaned.value),
  },
  {
    label: t('tools.case-converter.texts.label-dotcase'),
    value: dotCase(inputCleaned.value),
  },
  {
    label: t('tools.case-converter.texts.label-kebab-paramcase'),
    value: kebabCase(inputCleaned.value),
  },
  {
    label: t('tools.case-converter.texts.label-nocase'),
    value: noCase(inputCleaned.value),
  },
  {
    label: t('tools.case-converter.texts.label-train-headercase'),
    value: trainCase(inputCleaned.value),
  },
  {
    label: t('tools.case-converter.texts.label-pascalcase'),
    value: pascalCase(inputCleaned.value),
  },
  {
    label: t('tools.case-converter.texts.label-pathcase'),
    value: pathCase(inputCleaned.value),
  },
  {
    label: t('tools.case-converter.texts.label-sentencecase'),
    value: sentenceCase(inputCleaned.value),
  },
  {
    label: t('tools.case-converter.texts.label-snakecase'),
    value: snakeCase(inputCleaned.value),
  },
  {
    label: t('tools.case-converter.texts.label-mockingcase'),
    value: inputCleaned.value
      .split('')
      .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
      .join(''),
  },
]);

const inputLabelAlignmentConfig = {
  labelPosition: 'left',
  labelWidth: '125px',
  labelAlign: 'right',
};
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="input"
      :label="t('tools.case-converter.texts.label-your-string')"
      :placeholder="t('tools.case-converter.texts.placeholder-your-string')"
      raw-text
      v-bind="inputLabelAlignmentConfig"
      mb-1
    />

    <c-input-text
      v-model:value="cleaningRegex"
      :label="t('tools.case-converter.texts.label-cleaning-regex')"
      :placeholder="t('tools.case-converter.texts.placeholder-your-cleaning-regex')"
      raw-text
      v-bind="inputLabelAlignmentConfig"
      mb-1
    />

    <div my-16px divider />

    <InputCopyable
      v-for="format in formats"
      :key="format.label"
      :value="format.value"
      :label="format.label"
      v-bind="inputLabelAlignmentConfig"
      mb-1
    />
  </c-card>
</template>
