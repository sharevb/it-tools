<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parse as parseToml } from 'iarna-toml-esm';
import { stringify as stringifyToYaml } from 'yaml';
import { withDefaultOnError } from '../../utils/defaults';
import { isValidToml } from '../toml-to-json/toml.services';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => stringifyToYaml(parseToml(value)), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: isValidToml,
    message: t('tools.toml-to-yaml.texts.message-provided-toml-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.toml-to-yaml.texts.input-label-your-toml')"
    :input-placeholder="t('tools.toml-to-yaml.texts.input-placeholder-paste-your-toml-here')"
    :output-label="t('tools.toml-to-yaml.texts.output-label-yaml-from-your-toml')"
    output-language="yaml"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.yaml"
  />
</template>
