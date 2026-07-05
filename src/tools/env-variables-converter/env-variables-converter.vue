<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { NFormItem, NSelect } from 'naive-ui';
import deflate from './lib/deflate';
import inputHandler from './lib/inputHandler';
import outputFormatter from './lib/outputFormatter';
import { DefaultsMap, Formats, FormatsDesc, ModelType } from './lib/formats';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const defaultInputType = Formats.YAML;
const inputText = ref(DefaultsMap.get(defaultInputType)!.inputValue);
const inputType = useQueryParamOrStorage({ name: 'in', storageName: 'env-var-conv:i', defaultValue: defaultInputType });
const outputType = useQueryParamOrStorage({ name: 'out', storageName: 'env-var-conv:o', defaultValue: DefaultsMap.get(defaultInputType)!.outputType });
const alertText = ref('');

const inputOptions = Object.keys(Formats).map(key => ({ label: FormatsDesc[key], value: FormatsDesc[key] }));
const outputOptions = ref<{ label: Formats; value: Formats }[]>([]);

function updateOutputOptions() {
  const regular = [Formats.SIMPLE, Formats.TERMINAL, Formats.KUBERNETES].filter(opt => opt !== inputType.value);
  if (DefaultsMap.get(inputType.value)?.modelType === ModelType.FLAT) {
    regular.push(inputType.value === Formats.YAML ? Formats.PROPERTIES : Formats.YAML);
  }
  outputOptions.value = regular.map(value => ({ label: value, value }));
}

const outputText = computed(() => {
  alertText.value = '';
  try {
    return outputFormatter(outputType.value, deflate(inputHandler(inputType.value, inputText.value)));
  }
  catch (error: any) {
    alertText.value = error.toString();
    return '';
  }
});

function onChangeInputTypeHandler(value: string) {
  outputType.value = DefaultsMap.get(value)!.outputType;
  updateOutputOptions();
}

updateOutputOptions();
</script>

<template>
  <NForm>
    <NFormItem :label="t('tools.env-variables-converter.texts.label-input-type')">
      <NSelect v-model:value="inputType" :options="inputOptions" @update:value="onChangeInputTypeHandler" />
    </NFormItem>
    <c-input-text v-model:value="inputText" :label="t('tools.env-variables-converter.texts.label-input')" rows="10" multiline />
    <NFormItem :label="t('tools.env-variables-converter.texts.label-output-type')">
      <NSelect v-model:value="outputType" :options="outputOptions" />
    </NFormItem>
    <c-alert v-if="alertText" type="error">
      {{ alertText }}
    </c-alert>
    <c-card :title="t('tools.env-variables-converter.texts.title-output')">
      <textarea-copyable v-model:value="outputText" />
    </c-card>
  </NForm>
</template>
