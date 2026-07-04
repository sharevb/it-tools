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
import { spongeCase } from 'sponge-case';
import { swapCase } from 'swap-case';
import { titleCase } from 'title-case';

import InputCopyable from '../../components/InputCopyable.vue';
import { useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';
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

const input = useQueryParam({ tool: 'case-conv', name: 'text', defaultValue: 'lorem ipsum dolor sit amet' });
const inputCleaned = computed(() => {
  if (!cleaningRegexValidation.isValid) {
    return input.value.split('\n');
  }
  return input.value.replace(new RegExp(cleaningRegex.value, 'g'), '').split('\n');
});

const formats = computed(() => [
  {
    label: t('tools.case-converter.texts.label-lowercase'),
    value: inputCleaned.value.map(s => s.toLocaleLowerCase()),
  },
  {
    label: t('tools.case-converter.texts.label-uppercase'),
    value: inputCleaned.value.map(s => s.toLocaleUpperCase()),
  },
  {
    label: t('tools.case-converter.texts.label-camelcase'),
    value: inputCleaned.value.map(s => camelCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-titlecase'),
    value: inputCleaned.value.map(s => titleCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-capitalcase'),
    value: inputCleaned.value.map(s => capitalCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-constantcase'),
    value: inputCleaned.value.map(s => constantCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-dotcase'),
    value: inputCleaned.value.map(s => dotCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-kebab-paramcase'),
    value: inputCleaned.value.map(s => kebabCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-nocase'),
    value: inputCleaned.value.map(s => noCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-train-headercase'),
    value: inputCleaned.value.map(s => trainCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-pascalcase'),
    value: inputCleaned.value.map(s => pascalCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-pathcase'),
    value: inputCleaned.value.map(s => pathCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-sentencecase'),
    value: inputCleaned.value.map(s => sentenceCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-snakecase'),
    value: inputCleaned.value.map(s => snakeCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-mockingcase'),
    value: inputCleaned.value.map(s => s
      .split('')
      .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
      .join('')),
  },
  {
    label: t('tools.case-converter.texts.label-spongecase'),
    value: inputCleaned.value.map(s => spongeCase(s)),
  },
  {
    label: t('tools.case-converter.texts.label-swapcase'),
    value: inputCleaned.value.map(s => swapCase(s)),
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
      multiline
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
      :value="format.value?.join('\n')"
      :label="format.label"
      v-bind="inputLabelAlignmentConfig"
      multiline mb-1
    />
  </c-card>
</template>
