<script setup lang="ts">
import { useObfuscateJavascript } from './javascript-obfuscator.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const code = ref(`function greet(name) {
  console.log('Hello ' + name);
}
greet('World');`);
const method = useQueryParamOrStorage<'base64' | 'rot13' | 'obfuscator.io'>({ name: 'method', storageName: 'js-obfusc:m', defaultValue: 'base64' });

const methods = [
  {
    label: 'Base 64',
    value: 'base64',
  },
  {
    label: 'ROT 13',
    value: 'rot13',
  },
  {
    label: 'Obfuscator.io',
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
      label="Your JavaScript code to obfuscate:"
      placeholder="// Enter your JavaScript code here&#10;function example() {&#10;  console.log('Hello World');&#10;}"
      multiline
      rows="12"
      mb-2
    />

    <c-select
      v-model:value="method"
      label="Obfuscation method:"
      label-position="left"
      :options="methods"
      mb-2
    />

    <c-card v-if="obfuscated" title="Obfuscted JS Code">
      <textarea-copyable
        :value="obfuscated"
        language="js"
        download-file-name="obfuscated.js"
      />
    </c-card>
  </div>
</template>
