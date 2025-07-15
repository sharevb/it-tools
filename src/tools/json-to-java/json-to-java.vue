<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { convert } from './json-to-java.service';
import type { UseValidationRule } from '@/composable/validation';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const jsonInput = ref('');
const clazzInput = ref('Result');
const goOutput = computed(() => {
  return jsonInput.value ? convert(clazzInput.value, jsonInput.value) : '';
});

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-java.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <c-card :title="t('tools.json-to-java.texts.title-json-to-java-entity')">
    <c-input-text
      v-model:value="clazzInput"
      :placeholder="t('tools.json-to-java.texts.placeholder-custom-class-name')"
      raw-text
      :label="t('tools.json-to-java.texts.label-classname')"
      label-position="left"
      label-width="50px"
      mb-2
    />
    <c-input-text
      v-model:value="jsonInput"
      multiline
      :placeholder="t('tools.json-to-java.texts.placeholder-put-your-josn-string-here')"
      rows="20"
      :label="t('tools.json-to-java.texts.label-json-to-java')"
      :validation-rules="rules"
      raw-text
      mb-5
    />
  </c-card>
  <c-card :title="t('tools.json-to-java.texts.title-you-java-string')">
    <TextareaCopyable
      :value="goOutput"
      language="json"
    />
  </c-card>
</template>
