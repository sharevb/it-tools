<script setup lang="ts">
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

const cleaningRegex = useQueryParamOrStorage({ name: 'clean', storageName: 'case-conv:cl', defaultValue: '[^\\w\\d\\s]' });
const cleaningRegexValidation = useValidation({
  source: cleaningRegex,
  rules: [
    {
      message: 'Invalid cleaning regex: {0}',
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
    label: 'Lowercase:',
    value: inputCleaned.value.toLocaleLowerCase(),
  },
  {
    label: 'Uppercase:',
    value: inputCleaned.value.toLocaleUpperCase(),
  },
  {
    label: 'Camelcase:',
    value: camelCase(inputCleaned.value),
  },
  {
    label: 'Capitalcase:',
    value: capitalCase(inputCleaned.value),
  },
  {
    label: 'Constantcase:',
    value: constantCase(inputCleaned.value),
  },
  {
    label: 'Dotcase:',
    value: dotCase(inputCleaned.value),
  },
  {
    label: 'Kebab/paramcase:',
    value: kebabCase(inputCleaned.value),
  },
  {
    label: 'Nocase:',
    value: noCase(inputCleaned.value),
  },
  {
    label: 'Train/headercase:',
    value: trainCase(inputCleaned.value),
  },
  {
    label: 'Pascalcase:',
    value: pascalCase(inputCleaned.value),
  },
  {
    label: 'Pathcase:',
    value: pathCase(inputCleaned.value),
  },
  {
    label: 'Sentencecase:',
    value: sentenceCase(inputCleaned.value),
  },
  {
    label: 'Snakecase:',
    value: snakeCase(inputCleaned.value),
  },
  {
    label: 'Mockingcase:',
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
      label="Your string:"
      placeholder="Your string..."
      raw-text
      v-bind="inputLabelAlignmentConfig"
      mb-1
    />

    <c-input-text
      v-model:value="cleaningRegex"
      label="Cleaning regex:"
      placeholder="Your cleaning regex..."
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
