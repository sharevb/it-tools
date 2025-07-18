<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { formatXml, isValidXML } from './xml-formatter.service';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();

const defaultValue = '<hello><world>foo</world><world>bar</world></hello>';
const indentSize = useStorage('xml-formatter:indent-size', 2);
const collapseContent = useStorage('xml-formatter:collapse-content', true);

function transformer(value: string) {
  return formatXml(value, {
    indentation: ' '.repeat(indentSize.value),
    collapseContent: collapseContent.value,
    lineSeparator: '\n',
  });
}

const rules: UseValidationRule<string>[] = [
  {
    validator: isValidXML,
    message: t('tools.xml-formatter.texts.message-provided-xml-is-not-valid'),
  },
];
</script>

<template>
  <div important:flex-full important:flex-shrink-0 important:flex-grow-0>
    <div flex justify-center>
      <n-form-item :label="t('tools.xml-formatter.texts.label-collapse-content')" label-placement="left">
        <n-switch v-model:value="collapseContent" />
      </n-form-item>
      <n-form-item :label="t('tools.xml-formatter.texts.label-indent-size')" label-placement="left" label-width="100" :show-feedback="false">
        <n-input-number v-model:value="indentSize" min="0" max="10" w-100px />
      </n-form-item>
    </div>
  </div>

  <format-transformer
    :input-label="t('tools.xml-formatter.texts.input-label-your-xml')"
    :input-placeholder="t('tools.xml-formatter.texts.input-placeholder-paste-your-xml-here')"
    :output-label="t('tools.xml-formatter.texts.output-label-formatted-xml-from-your-xml')"
    output-language="xml"
    :input-validation-rules="rules"
    :transformer="transformer"
    :input-default="defaultValue"
    download-file-name="output.xml"
  />
</template>
