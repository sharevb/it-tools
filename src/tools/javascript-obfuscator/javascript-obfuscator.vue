<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useObfuscateJavascript } from './javascript-obfuscator.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const code = ref(`function greet(name) {
  console.log('Hello ' + name);
}
greet('World');`);
const method = useQueryParamOrStorage<'base64' | 'rot13' | 'obfuscator.io'>({ name: 'method', storageName: 'js-obfusc:m', defaultValue: 'base64' });

const methods = [
  {
    label: t('tools.javascript-obfuscator.texts.label-base-64'),
    value: 'base64',
  },
  {
    label: t('tools.javascript-obfuscator.texts.label-rot-13'),
    value: 'rot13',
  },
  {
    label: t('tools.javascript-obfuscator.texts.label-obfuscator-io'),
    value: 'obfuscator.io',
  },
];

const obfuscated = useObfuscateJavascript(code, method);
</script>

<template>
  <div>
    <c-input-text
      v-model:value="code"
      raw-text
      :label="t('tools.javascript-obfuscator.texts.label-your-javascript-code-to-obfuscate')"
      :placeholder="`${t('tools.javascript-obfuscator.texts.placeholder-enter-your-javascript-code-here')}\nfunction example()\n{\n  console.log('Hello World');\n}`"
      multiline
      rows="12"
      mb-2
    />

    <c-select
      v-model:value="method"
      :label="t('tools.javascript-obfuscator.texts.label-obfuscation-method')"
      label-position="left"
      :options="methods"
      mb-2
    />

    <c-card v-if="obfuscated" :title="t('tools.javascript-obfuscator.texts.title-obfuscted-js-code')">
      <textarea-copyable
        :value="obfuscated"
        language="js"
        download-file-name="obfuscated.js"
      />
    </c-card>
  </div>
</template>
