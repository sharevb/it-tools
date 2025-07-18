<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { InputData, jsonInputForTargetLanguage, quicktype } from 'quicktype-core';
import type { UseValidationRule } from '@/composable/validation';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const defaultValue = `{
  a:"n",
  arr: [1, 2], 
  nested: {
    a:1,
    b:"2"
  }
}`;
const jsonInput = ref(defaultValue);
const rootName = useQueryParamOrStorage({ name: 'root', storageName: 'json-php:r', defaultValue: 'GeneratedClass' });
const createGetter = useQueryParamOrStorage({ name: 'getter', storageName: 'json-php:pv', defaultValue: true });
const getterWithoutValidation = useQueryParamOrStorage({ name: 'novalid', storageName: 'json-php:cl', defaultValue: false });
const createSetter = useQueryParamOrStorage({ name: 'setter', storageName: 'json-php:pn', defaultValue: true });
const phpClosingTag = useQueryParamOrStorage({ name: 'closing', storageName: 'json-php:pn', defaultValue: true });
const optionalProperties = useQueryParamOrStorage({ name: 'optional', storageName: 'json-php:op', defaultValue: false });

async function convertJsonToPHP(json: string,
  options: {
    rootName: string
    createGetter?: boolean
    getterWithoutValidation?: boolean
    createSetter?: boolean
    phpClosingTag?: boolean
    optionalProperties?: boolean
  }): Promise<string> {
  const jsonInput = jsonInputForTargetLanguage('php');
  await jsonInput.addSource({ name: options.rootName, samples: [JSON.stringify(JSON5.parse(json))] });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const { lines } = await quicktype({
    inputData,
    lang: 'php',
    topLevel: options.rootName,
    allPropertiesOptional: options.optionalProperties,
    rendererOptions: {
      'with-get': options.createGetter,
      'fast-get': options.getterWithoutValidation,
      'with-set': options.createSetter,
      'with-closing': options.phpClosingTag,
    },
  } as any);
  return lines.join('\n');
}

const phpOutput = computedAsync(async () => {
  try {
    return await convertJsonToPHP(jsonInput.value,
      {
        rootName: rootName.value,
        createGetter: createGetter.value,
        getterWithoutValidation: getterWithoutValidation.value,
        createSetter: createSetter.value,
        phpClosingTag: phpClosingTag.value,
        optionalProperties: optionalProperties.value,
      },
    );
  }
  catch (e: any) {
    return e.toString();
  }
});

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-php.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <c-card :title="t('tools.json-to-php.texts.title-json-to-php')">
    <c-input-text
      v-model:value="jsonInput"
      multiline
      :placeholder="t('tools.json-to-php.texts.placeholder-put-your-json-string-here')"
      rows="20"
      :label="t('tools.json-to-php.texts.label-your-json-object')"
      :validation-rules="rules"
      raw-text
      mb-5
    />
    <c-input-text v-model:value="rootName" :label="t('tools.json-to-php.texts.label-root-name')" label-position="left" mb-2 />
    <n-space justify="center">
      <n-checkbox v-model:checked="createGetter">
        {{ t('tools.json-to-php.texts.tag-create-getter') }}
      </n-checkbox>
      <n-checkbox v-model:checked="getterWithoutValidation">
        {{ t('tools.json-to-php.texts.tag-getter-without-validation') }}
      </n-checkbox>
      <n-checkbox v-model:checked="createSetter">
        {{ t('tools.json-to-php.texts.tag-create-setter') }}
      </n-checkbox>
      <n-checkbox v-model:checked="phpClosingTag">
        {{ t('tools.json-to-php.texts.tag-php-closing-tag') }}
      </n-checkbox>
      <n-checkbox v-model:checked="optionalProperties">
        {{ t('tools.json-to-php.texts.tag-make-all-properties-optional') }}
      </n-checkbox>
    </n-space>
  </c-card>
  <c-card :title="t('tools.json-to-php.texts.title-your-php-code')">
    <TextareaCopyable
      :value="phpOutput"
      language="php"
    />
  </c-card>
</template>
