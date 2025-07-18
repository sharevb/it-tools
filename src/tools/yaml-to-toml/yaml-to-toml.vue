<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { stringify as stringifyToml } from 'iarna-toml-esm';
import { parse as parseYaml } from 'yaml';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();

const convertYamlToToml = (value: string) => [stringifyToml(parseYaml(value))].flat().join('\n').trim();

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertYamlToToml(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || parseYaml(v),
    message: t('tools.yaml-to-toml.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.yaml-to-toml.texts.input-label-your-yaml')"
    :input-placeholder="t('tools.yaml-to-toml.texts.input-placeholder-paste-your-yaml-here')"
    :output-label="t('tools.yaml-to-toml.texts.output-label-toml-from-your-yaml')"
    output-language="toml"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.toml"
  />
</template>
