<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import json2csharp from './json2csharp';
import type { UseValidationRule } from '@/composable/validation';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnError } from '@/utils/defaults';
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
const pascalCase = useQueryParamOrStorage({ name: 'pascalcase', storageName: 'json-c#:pc', defaultValue: true });
const useFields = useQueryParamOrStorage({ name: 'fields', storageName: 'json-c#:fi', defaultValue: false });
const useNullable = useQueryParamOrStorage({ name: 'nullable', storageName: 'json-c#:null', defaultValue: false });
const addJsonProperty = useQueryParamOrStorage({ name: 'pascal', storageName: 'json-c#:jsp', defaultValue: false });
const nullValueHandlingIgnore = useQueryParamOrStorage({ name: 'pascal', storageName: 'json-c#:ign', defaultValue: true });
const addJsonPropertyName = useQueryParamOrStorage({ name: 'pascal', storageName: 'json-c#:jspp', defaultValue: true });
const generateImmutableClasses = useQueryParamOrStorage({ name: 'pascal', storageName: 'json-c#:imm', defaultValue: false });
const useRecordTypes = useQueryParamOrStorage({ name: 'pascal', storageName: 'json-c#:rec', defaultValue: true });
const useReadonlyLists = useQueryParamOrStorage({ name: 'pascal', storageName: 'json-c#:rdl', defaultValue: false });
const rootTypeName = useQueryParamOrStorage({ name: 'root', storageName: 'json-c#:rt', defaultValue: 'Root' });

const csharpOutput = computed(() => withDefaultOnError(
  () => json2csharp({
    src: JSON5.parse(jsonInput.value),
    rootTypeName: rootTypeName.value,
    pascalCase: pascalCase.value,
    useFields: useFields.value,
    useNullable: useNullable.value,
    addJsonProperty: addJsonProperty.value,
    nullValueHandlingIgnore: nullValueHandlingIgnore.value,
    addJsonPropertyName: addJsonPropertyName.value,
    generateImmutableClasses: generateImmutableClasses.value,
    useRecordTypes: useRecordTypes.value,
    useReadonlyLists: useReadonlyLists.value,
  }), ''));
const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-csharp.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <div>
    <c-card :title="t('tools.json-to-csharp.texts.title-json-to-c')">
      <c-input-text
        v-model:value="jsonInput"
        multiline
        :placeholder="t('tools.json-to-csharp.texts.placeholder-put-your-json-string-here')"
        rows="10"
        :label="t('tools.json-to-csharp.texts.label-json-to-c')"
        :validation-rules="rules"
        raw-text
        mb-5
      />
      <n-space justify="center">
        <n-checkbox v-model:checked="pascalCase">
          {{ t('tools.json-to-csharp.texts.tag-use-pascal-case') }}
        </n-checkbox>
        <n-checkbox v-model:checked="useRecordTypes">
          {{ t('tools.json-to-csharp.texts.tag-use-record-types') }}
        </n-checkbox>
        <n-checkbox v-model:checked="generateImmutableClasses">
          {{ t('tools.json-to-csharp.texts.tag-generate-immutable-classes') }}
        </n-checkbox>
        <n-checkbox v-model:checked="useFields">
          {{ t('tools.json-to-csharp.texts.tag-use-fields') }}
        </n-checkbox>
        <n-checkbox v-model:checked="addJsonProperty">
          {{ t('tools.json-to-csharp.texts.tag-add-jsonproperty-attributes') }}
        </n-checkbox>
        <n-checkbox v-model:checked="nullValueHandlingIgnore" :disabled="!addJsonProperty">
          {{ t('tools.json-to-csharp.texts.tag-use-nullvaluehandling-ignore') }}
        </n-checkbox>
        <n-checkbox v-model:checked="addJsonPropertyName">
          {{ t('tools.json-to-csharp.texts.tag-add-jsonpropertyname-attributes') }}
        </n-checkbox>
        <n-checkbox v-model:checked="useNullable">
          {{ t('tools.json-to-csharp.texts.tag-use-nullable-types') }}
        </n-checkbox>
        <n-checkbox v-model:checked="useReadonlyLists">
          {{ t('tools.json-to-csharp.texts.tag-use-readonly-lists') }}
        </n-checkbox>
      </n-space>
      <c-input-text v-model:value="rootTypeName" :label="t('tools.json-to-csharp.texts.label-root-type-name')" :placeholder="t('tools.json-to-csharp.texts.placeholder-your-root-type-name')" clearable raw-text mb-5 />
    </c-card>
    <c-card :title="t('tools.json-to-csharp.texts.title-your-c-code')" mt-2>
      <TextareaCopyable
        :value="csharpOutput"
        language="csharp"
      />
    </c-card>
  </div>
</template>
