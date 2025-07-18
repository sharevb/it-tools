<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parse as parseToml } from 'iarna-toml-esm';
import { withDefaultOnError } from '../../utils/defaults';
import { isValidToml } from './toml.services';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();

const transformer = (value: string) => value === '' ? '' : withDefaultOnError(() => JSON.stringify(parseToml(value), null, 3), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: isValidToml,
    message: t('tools.toml-to-json.texts.message-provided-toml-is-not-valid'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.toml-to-json.texts.input-label-your-toml')"
    :input-placeholder="t('tools.toml-to-json.texts.input-placeholder-paste-your-toml-here')"
    :output-label="t('tools.toml-to-json.texts.output-label-json-from-your-toml')"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name="output.json"
  />
</template>
