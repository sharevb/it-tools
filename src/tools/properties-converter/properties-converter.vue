<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import yaml from 'yaml';
import properties from 'properties';
import { flatten } from 'flatten-anything';

const { t } = useI18n();

const defaultPropertiesValue = `app_name App

[web]
hostname 10.10.10.10
port 1234

[db]
hostname 10.10.10.20
port 4321`;
const defaultYamlValue = `app_name: App
web:
  hostname: 10.10.10.10
  port: 1234
db:
  hostname: 10.10.10.20
  port: 4321
`;
function fromProperties(value: string) {
  try {
    return yaml.stringify(properties.parse(value, { sections: true, namespaces: true }));
  }
  catch (e: any) {
    return e.toString();
  }
}
function toProperties(value: string) {
  try {
    return properties.stringify(flatten(yaml.parse(value)));
  }
  catch (e: any) {
    return e.toString();
  }
}
</script>

<template>
  <c-card :title="t('tools.properties-converter.texts.title-properties-to-yaml')">
    <format-transformer
      :input-label="t('tools.properties-converter.texts.input-label-your-properties-content')"
      :input-default="defaultPropertiesValue"
      :input-placeholder="t('tools.properties-converter.texts.input-placeholder-paste-your-properties-content-here')"
      :output-label="t('tools.properties-converter.texts.output-label-yaml-version')"
      output-language="yaml"
      :transformer="fromProperties"
    />
  </c-card>
  <c-card :title="t('tools.properties-converter.texts.title-yaml-to-properties')">
    <format-transformer
      :input-label="t('tools.properties-converter.texts.input-label-your-yaml-content')"
      :input-default="defaultYamlValue"
      :input-placeholder="t('tools.properties-converter.texts.input-placeholder-paste-your-yaml-content-here')"
      :output-label="t('tools.properties-converter.texts.output-label-properties-version')"
      output-language="ini"
      :transformer="toProperties"
    />
  </c-card>
</template>
