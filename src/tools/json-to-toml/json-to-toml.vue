<script setup lang="ts">
import { stringify as stringifyToml } from 'smol-toml';

import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();

const convertJsonToToml = (value: string) => [stringifyToml(JSON5.parse(value))].flat().join('\n').trim();

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertJsonToToml(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('tools.json-to-toml.texts.message-provided-json-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-toml.texts.input-label-your-json')"
    :input-placeholder="t('tools.json-to-toml.texts.input-placeholder-paste-your-json-here')"
    :output-label="t('tools.json-to-toml.texts.output-label-toml-from-your-json')"
    output-language="toml"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.toml"
  />
</template>
