<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useCopy } from '@/composable/copy';
import { base64ToText, isValidBase64, textToBase64 } from '@/utils/base64';
import { withDefaultOnError } from '@/utils/defaults';
import { useITStorage, useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const encodeUrlSafe = useITStorage('base64-string-converter:encode-url-safe', false);
const decodeUrlSafe = useITStorage('base64-string-converter:decode-url-safe', false);

const textInput = useQueryParam({ tool: 'base64-string-converter', name: 'text', defaultValue: '' });
const base64Output = computed(() => textToBase64(textInput.value, { makeUrlSafe: encodeUrlSafe.value }));
const { copy: copyTextBase64 } = useCopy({ source: base64Output, text: t('tools.base64-string-converter.texts.text-base64-string-copied-to-the-clipboard') });

const base64Input = useQueryParam({ tool: 'base64-string-converter', name: 'base64', defaultValue: '' });
const textOutput = computed(() =>
  withDefaultOnError(() => base64ToText(base64Input.value.trim(), { makeUrlSafe: decodeUrlSafe.value }), ''),
);
const { copy: copyText } = useCopy({ source: textOutput, text: t('tools.base64-string-converter.texts.text-string-copied-to-the-clipboard') });
const b64ValidationRules = [
  {
    message: t('tools.base64-string-converter.texts.message-invalid-base64-string'),
    validator: (value: string) => isValidBase64(value.trim(), { makeUrlSafe: decodeUrlSafe.value }),
  },
];
const b64ValidationWatch = [decodeUrlSafe];
</script>

<template>
  <c-card :title="t('tools.base64-string-converter.texts.title-string-to-base64')">
    <n-form-item :label="t('tools.base64-string-converter.texts.label-encode-url-safe')" label-placement="left">
      <n-switch v-model:value="encodeUrlSafe" />
    </n-form-item>
    <c-input-text
      v-model:value="textInput"
      multiline
      :placeholder="t('tools.base64-string-converter.texts.placeholder-put-your-string-here')"
      rows="5"
      :label="t('tools.base64-string-converter.texts.label-string-to-encode')"
      raw-text
      mb-5
    />

    <c-input-text
      :label="t('tools.base64-string-converter.texts.label-base64-of-string')"
      :value="base64Output"
      multiline
      readonly
      :placeholder="t('tools.base64-string-converter.texts.placeholder-the-base64-encoding-of-your-string-will-be-here')"
      rows="5"
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyTextBase64()">
        {{ t('tools.base64-string-converter.texts.tag-copy-base64') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.base64-string-converter.texts.title-base64-to-string')">
    <n-form-item :label="t('tools.base64-string-converter.texts.label-decode-url-safe')" label-placement="left">
      <n-switch v-model:value="decodeUrlSafe" />
    </n-form-item>
    <c-input-text
      v-model:value="base64Input"
      multiline
      :placeholder="t('tools.base64-string-converter.texts.placeholder-your-base64-string')"
      rows="5"
      :validation-rules="b64ValidationRules"
      :validation-watch="b64ValidationWatch"
      :label="t('tools.base64-string-converter.texts.label-base64-string-to-decode')"
      mb-5
    />

    <c-input-text
      v-model:value="textOutput"
      :label="t('tools.base64-string-converter.texts.label-decoded-string')"
      :placeholder="t('tools.base64-string-converter.texts.placeholder-the-decoded-string-will-be-here')"
      multiline
      rows="5"
      readonly
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyText()">
        {{ t('tools.base64-string-converter.texts.tag-copy-decoded-string') }}
      </c-button>
    </div>
  </c-card>
</template>
