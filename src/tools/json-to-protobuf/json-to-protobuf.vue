<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import GenerateSchema from 'generate-schema';
import JSON5 from 'json5';
import convert from 'jsonschema-protobuf';
import FormatTransformer from '@/components/FormatTransformer.vue';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();

const rootName = ref<string>('RootName');

function transformer(value: string) {
  try {
    const object = JSON5.parse(value);
    const schema = JSON.stringify({ ...{ name: rootName.value }, ...GenerateSchema.json(rootName.value, object) });
    return convert(schema);
  }
  catch (e: any) {
    return e.toString();
  }
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-protobuf.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <c-input-text v-model:value="rootName" :label="t('tools.json-to-protobuf.texts.label-root-name')" label-placement="left" />

  <FormatTransformer
    :input-label="t('tools.json-to-protobuf.texts.input-label-your-json')"
    :input-placeholder="t('tools.json-to-protobuf.texts.input-placeholder-paste-your-json-here')"
    :output-label="t('tools.json-to-protobuf.texts.output-label-protobuf-version-of-your-json-objects')"
    :input-validation-rules="rules"
    :transformer="transformer"
    output-language="protobuf"
  />
</template>
