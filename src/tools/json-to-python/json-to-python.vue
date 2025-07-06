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
const rootName = useQueryParamOrStorage({ name: 'root', storageName: 'json-python:r', defaultValue: 'GeneratedClass' });
const pythonVersion = useQueryParamOrStorage({ name: 'version', storageName: 'json-python:pv', defaultValue: '3.6' });
const classesOnly = useQueryParamOrStorage({ name: 'classes', storageName: 'json-python:cl', defaultValue: false });
const pythonicNames = useQueryParamOrStorage({ name: 'pythonic', storageName: 'json-python:pn', defaultValue: true });
const pydanticBaseModel = useQueryParamOrStorage({ name: 'basemodel', storageName: 'json-python:bm', defaultValue: false });
const optionalProperties = useQueryParamOrStorage({ name: 'optional', storageName: 'json-python:op', defaultValue: false });

async function convertJsonToPython(json: string,
  {
    pythonVersion = '3.9',
    classesOnly = true,
    pythonicNames = true,
    optionalProperties = true,
    pydanticBaseModel = false,
    rootName = 'GeneratedClass',
  }: {
    pythonVersion?: string
    classesOnly?: boolean
    pythonicNames?: boolean
    optionalProperties?: boolean
    rootName?: string
    pydanticBaseModel?: boolean
  } = {},
) {
  const jsonInput = jsonInputForTargetLanguage('python');
  await jsonInput.addSource({ name: rootName, samples: [JSON.stringify(JSON5.parse(json))] });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const result = await quicktype({
    inputData,
    lang: 'python',
    allPropertiesOptional: optionalProperties,
    topLevel: rootName,
    rendererOptions: {
      'python-version': pythonVersion,
      'just-types': classesOnly,
      'nice-property-names': pythonicNames,
      'pydantic-base-model': pydanticBaseModel,
    },
  } as any);

  return result.lines.join('\n');
}
const pythonOutput = computedAsync(async () => {
  try {
    return await convertJsonToPython(jsonInput.value,
      {
        rootName: rootName.value,
        pythonVersion: pythonVersion.value,
        classesOnly: classesOnly.value,
        pythonicNames: pythonicNames.value,
        optionalProperties: optionalProperties.value,
        pydanticBaseModel: pydanticBaseModel.value,
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
    message: t('tools.json-to-python.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <c-card :title="t('tools.json-to-python.texts.title-json-to-python')">
    <c-input-text
      v-model:value="jsonInput"
      multiline
      :placeholder="t('tools.json-to-python.texts.placeholder-put-your-json-string-here')"
      rows="20"
      :label="t('tools.json-to-python.texts.label-json-object')"
      :validation-rules="rules"
      raw-text
      mb-5
    />
    <c-input-text v-model:value="rootName" :label="t('tools.json-to-python.texts.label-root-name')" label-position="left" mb-2 />
    <n-space justify="center" items-center>
      <c-select
        v-model:value="pythonVersion"
        :options="['3.5', '3.6', '3.7']"
        label-position="left"
        :label="t('tools.json-to-python.texts.label-python-version')"
        :placeholder="t('tools.json-to-python.texts.placeholder-python-version')"
      />
      <n-checkbox v-model:checked="classesOnly">
        {{ t('tools.json-to-python.texts.tag-classes-only') }}
      </n-checkbox>
      <n-checkbox v-model:checked="pythonicNames">
        {{ t('tools.json-to-python.texts.tag-transform-property-names-to-be-pythonic') }}
      </n-checkbox>
      <n-checkbox v-model:checked="pydanticBaseModel">
        {{ t('tools.json-to-python.texts.tag-uses-pydantic-basemodel') }}
      </n-checkbox>
      <n-checkbox v-model:checked="optionalProperties">
        {{ t('tools.json-to-python.texts.tag-make-all-properties-optional') }}
      </n-checkbox>
    </n-space>
  </c-card>
  <c-card :title="t('tools.json-to-python.texts.title-your-python-code')">
    <TextareaCopyable
      :value="pythonOutput"
      language="python"
    />
  </c-card>
</template>
