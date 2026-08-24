<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { convertJsonToEnv } from './json-to-env.service';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const defaultValue = '{\n  "ACCESS_KEY": "mySecretAccessKey",\n  "AMQP_DNS": "amqp://a:b@rabbit/po",\n  "APP_ENV": "prod"\n}';

function transformer(value: string) {
  return withDefaultOnError(() => {
    if (value === '') {
      return '';
    }
    return convertJsonToEnv({ json: value });
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => {
      if (v === '') {
        return true;
      }
      const parsed = JSON5.parse(v);
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
    },
    message: t('tools.json-to-env.texts.message-provided-json-is-not-a-valid-flat-object'),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-env.texts.input-label-your-json')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.json-to-env.texts.input-placeholder-paste-your-json-here')"
    :output-label="t('tools.json-to-env.texts.output-label-env-from-your-json')"
    output-language="bash"
    :input-validation-rules="rules"
    :transformer="transformer"
    download-file-name=".env"
  />
</template>
