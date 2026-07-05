<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useCopy } from '@/composable/copy';
import { useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

const encodings = [
  { value: 'URIComponent', label: t('tools.url-encoder.texts.label-uricomponent') },
  { value: 'RFC3986URIComponent', label: t('tools.url-encoder.texts.label-rfc3986-uricomponent') },
  { value: 'RFC5987', label: t('tools.url-encoder.texts.label-rfc5987-link-content-disposition') },
  { value: 'URI', label: t('tools.url-encoder.texts.label-uri') },
  { value: 'RFC3986URI', label: t('tools.url-encoder.texts.label-rfc3986-uri') },
];
const encoding = useQueryParamOrStorage({ name: 'enc', storageName: 'url-encode:enc', defaultValue: 'URIComponent' });

function encodeRFC3986URIComponent(str: string) {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c: string) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function encodeRFC5987ValueChars(str: string) {
  return (
    encodeURIComponent(str)
      // The following creates the sequences %27 %28 %29 %2A (Note that
      // the valid encoding of "*" is %2A, which necessitates calling
      // toUpperCase() to properly encode). Although RFC3986 reserves "!",
      // RFC5987 does not, so we do not need to escape it.
      .replace(
        /['()*]/g,
        c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
      )
      // The following are not required for percent-encoding per RFC5987,
      // so we can allow for a little better readability over the wire: |`^
      .replace(/%(7C|60|5E)/g, (str, hex) =>
        String.fromCharCode(Number.parseInt(hex, 16)),
      )
  );
}

function encodeRFC3986URI(str: string) {
  return encodeURI(str)
    .replace(/%5B/g, '[')
    .replace(/%5D/g, ']')
    .replace(
      /[!'()*]/g,
      c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
    );
}

function encode(str: string) {
  if (encoding.value === 'URIComponent') {
    return encodeURIComponent(str);
  }
  if (encoding.value === 'RFC3986URIComponent') {
    return encodeRFC3986URIComponent(str);
  }
  if (encoding.value === 'RFC5987') {
    return encodeRFC5987ValueChars(str);
  }
  if (encoding.value === 'URI') {
    return encodeURI(str);
  }
  if (encoding.value === 'RFC3986URI') {
    return encodeRFC3986URI(str);
  }
  return str;
}

const encodeInput = useQueryParam({ tool: 'url-encoder', name: 'encode', defaultValue: 'Hello world :)' });
const encodeOutput = computed(() => withDefaultOnError(() => encode(encodeInput.value), ''));

const encodedValidation = useValidation({
  source: encodeInput,
  rules: [
    {
      validator: value => isNotThrowing(() => encode(value)),
      message: t('tools.url-encoder.texts.message-impossible-to-parse-this-string'),
    },
  ],
});

const { copy: copyEncoded } = useCopy({ source: encodeOutput, text: t('tools.url-encoder.texts.text-encoded-string-copied-to-the-clipboard') });

const decodeInput = useQueryParam({ tool: 'url-encoder', name: 'decode', defaultValue: 'Hello%20world%20%3A)' });
const decodeOutput = computed(() => withDefaultOnError(() => decodeURIComponent(decodeInput.value), ''));

const decodeValidation = useValidation({
  source: encodeInput,
  rules: [
    {
      validator: value => isNotThrowing(() => decodeURIComponent(value)),
      message: t('tools.url-encoder.texts.message-impossible-to-parse-this-string'),
    },
  ],
});

const { copy: copyDecoded } = useCopy({ source: decodeOutput, text: t('tools.url-encoder.texts.text-decoded-string-copied-to-the-clipboard') });
</script>

<template>
  <c-card :title="t('tools.url-encoder.texts.title-encode')">
    <c-select
      v-model:value="encoding"
      :label="t('tools.url-encoder.texts.label-encoding-kind')"
      label-position="left"
      :options="encodings"
    />

    <n-divider />

    <c-input-text
      v-model:value="encodeInput"
      :label="t('tools.url-encoder.texts.label-your-string')"
      :validation="encodedValidation"
      multiline
      autosize
      :placeholder="t('tools.url-encoder.texts.placeholder-the-string-to-encode')"
      rows="2"
      mb-3
    />

    <c-input-text
      :label="t('tools.url-encoder.texts.label-your-string-encoded')"
      :value="encodeOutput"
      multiline
      autosize
      readonly
      :placeholder="t('tools.url-encoder.texts.placeholder-your-string-encoded')"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyEncoded()">
        {{ t('tools.url-encoder.texts.tag-copy') }}
      </c-button>
    </div>
  </c-card>
  <c-card :title="t('tools.url-encoder.texts.title-decode')">
    <c-input-text
      v-model:value="decodeInput"
      :label="t('tools.url-encoder.texts.label-your-encoded-string')"
      :validation="decodeValidation"
      multiline
      autosize
      :placeholder="t('tools.url-encoder.texts.placeholder-the-string-to-decode')"
      rows="2"
      mb-3
    />

    <c-input-text
      :label="t('tools.url-encoder.texts.label-your-string-decoded')"
      :value="decodeOutput"
      multiline
      autosize
      readonly
      :placeholder="t('tools.url-encoder.texts.placeholder-your-string-decoded')"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyDecoded()">
        {{ t('tools.url-encoder.texts.tag-copy') }}
      </c-button>
    </div>
  </c-card>
</template>
