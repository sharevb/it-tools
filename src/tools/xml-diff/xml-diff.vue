<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import DiffsViewer from './diff-viewer/xml-diff-viewer.vue';
import { isValidXML, parseXml } from './xml-diff.parser';

const rawLeftXml = ref('');
const rawRightXml = ref('');

const leftXml = computed(() => parseXml(rawLeftXml.value));
const rightXml = computed(() => parseXml(rawRightXml.value));

const xmlValidationRules = [
  {
    validator: (value: string) => isValidXML(value),
    message: t('tools.xml-diff.texts.message-invalid-xml-format'),
  },
];
</script>

<template>
  <c-input-text
    v-model:value="rawLeftXml"
    :validation-rules="xmlValidationRules"
    :label="t('tools.xml-diff.texts.label-your-first-xml')"
    :placeholder="t('tools.xml-diff.texts.placeholder-paste-your-first-xml-here')"
    rows="20"
    test-id="leftXml"
    raw-text
    multiline
    monospace
  />

  <c-input-text
    v-model:value="rawRightXml"
    :validation-rules="xmlValidationRules"
    :label="t('tools.xml-diff.texts.label-your-xml-to-compare')"
    :placeholder="t('tools.xml-diff.texts.placeholder-paste-your-xml-to-compare-here')"
    rows="20"
    multiline
    test-id="rightXml"
    raw-text
    monospace
  />

  <DiffsViewer :left-xml="leftXml" :right-xml="rightXml" />
</template>
