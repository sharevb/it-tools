<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useCopy } from '@/composable/copy';
import { base64ToText, isValidBase64, textToBase64 } from '@/utils/base64';
import { withDefaultOnError } from '@/utils/defaults';
import { useITStorage, useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const encodeUrlSafe = useITStorage('base64-string-converter:encode-url-safe', false);
const decodeUrlSafe = useITStorage('base64-string-converter:decode-url-safe', false);

const encoding = useQueryParamOrStorage({
  storageName: 'base64-string-converter:encoding',
  name: 'encoding',
  defaultValue: 'utf8',
});

const textInput = useQueryParam({ tool: 'base64-string-converter', name: 'text', defaultValue: '' });
const base64Output = computed(() =>
  textToBase64(textInput.value, { makeUrlSafe: encodeUrlSafe.value, encoding: encoding.value }),
);
const { copy: copyTextBase64 } = useCopy({
  source: base64Output,
  text: t('tools.base64-string-converter.texts.text-base64-string-copied-to-the-clipboard'),
});

const base64Input = useQueryParam({ tool: 'base64-string-converter', name: 'base64', defaultValue: '' });
const textOutput = computed(() =>
  withDefaultOnError(
    () => base64ToText(base64Input.value.trim(), { makeUrlSafe: decodeUrlSafe.value, encoding: encoding.value }),
    '',
  ),
);
const { copy: copyText } = useCopy({
  source: textOutput,
  text: t('tools.base64-string-converter.texts.text-string-copied-to-the-clipboard'),
});
const b64ValidationRules = [
  {
    message: t('tools.base64-string-converter.texts.message-invalid-base64-string'),
    validator: (value: string) => isValidBase64(value.trim(), { makeUrlSafe: decodeUrlSafe.value }),
  },
];
const b64ValidationWatch = [decodeUrlSafe];

const encodings = [
  { label: 'UTF-8', value: 'utf8' },
  { label: 'UTF-8 (Alias: UTF8)', value: 'utf-8' },

  { label: 'UTF-16LE', value: 'utf16le' },
  { label: 'UTF-16BE', value: 'utf16be' },

  { label: 'UTF-7', value: 'utf7' },
  { label: 'UTF-7 (IMAP)', value: 'utf7imap' },

  { label: 'UTF-32LE', value: 'utf32le' },
  { label: 'UTF-32BE', value: 'utf32be' },

  { label: 'ISO-8859-1 (Latin-1)', value: 'latin1' },
  { label: 'ISO-8859-2 (Central European)', value: 'iso-8859-2' },
  { label: 'ISO-8859-3 (South European)', value: 'iso-8859-3' },
  { label: 'ISO-8859-4 (North European)', value: 'iso-8859-4' },
  { label: 'ISO-8859-5 (Cyrillic)', value: 'iso-8859-5' },
  { label: 'ISO-8859-6 (Arabic)', value: 'iso-8859-6' },
  { label: 'ISO-8859-7 (Greek)', value: 'iso-8859-7' },
  { label: 'ISO-8859-8 (Hebrew)', value: 'iso-8859-8' },
  { label: 'ISO-8859-9 (Turkish)', value: 'iso-8859-9' },
  { label: 'ISO-8859-10 (Nordic)', value: 'iso-8859-10' },
  { label: 'ISO-8859-13 (Baltic)', value: 'iso-8859-13' },
  { label: 'ISO-8859-14 (Celtic)', value: 'iso-8859-14' },
  { label: 'ISO-8859-15 (Latin-9)', value: 'iso-8859-15' },
  { label: 'ISO-8859-16 (Romanian)', value: 'iso-8859-16' },

  { label: 'Windows-1250 (Central European)', value: 'win1250' },
  { label: 'Windows-1251 (Cyrillic)', value: 'win1251' },
  { label: 'Windows-1252 (Western European)', value: 'win1252' },
  { label: 'Windows-1253 (Greek)', value: 'win1253' },
  { label: 'Windows-1254 (Turkish)', value: 'win1254' },
  { label: 'Windows-1255 (Hebrew)', value: 'win1255' },
  { label: 'Windows-1256 (Arabic)', value: 'win1256' },
  { label: 'Windows-1257 (Baltic)', value: 'win1257' },
  { label: 'Windows-1258 (Vietnamese)', value: 'win1258' },

  { label: 'KOI8-R (Russian)', value: 'koi8-r' },
  { label: 'KOI8-U (Ukrainian)', value: 'koi8-u' },

  { label: 'GBK (Simplified Chinese)', value: 'gbk' },
  { label: 'GB2312 (Simplified Chinese)', value: 'gb2312' },
  { label: 'GB18030 (Simplified Chinese)', value: 'gb18030' },

  { label: 'Big5 (Traditional Chinese)', value: 'big5' },

  { label: 'Shift-JIS (Japanese)', value: 'shift_jis' },
  { label: 'EUC-JP (Japanese)', value: 'euc-jp' },

  { label: 'MacRoman', value: 'macroman' },
  { label: 'MacGreek', value: 'macgreek' },
  { label: 'MacTurkish', value: 'macturkish' },
  { label: 'MacCyrillic', value: 'maccyrillic' },
  { label: 'MacCentralEurope', value: 'maccentraleurope' },
  { label: 'MacIceland', value: 'maciceland' },
];
</script>

<template>
  <c-card :title="t('tools.base64-string-converter.texts.title-string-to-base64')">
    <n-space>
      <n-form-item :label="t('tools.base64-string-converter.texts.label-encode-url-safe')" label-placement="left">
        <n-switch v-model:value="encodeUrlSafe" />
      </n-form-item>
      <c-select
        :label="t('tools.base64-string-converter.texts.text-encoding')"
        label-position="left"
        style="width: 400px"
        v-model:value="encoding"
        :options="encodings"
        searchable
      />
    </n-space>
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
      :placeholder="
        t('tools.base64-string-converter.texts.placeholder-the-base64-encoding-of-your-string-will-be-here')
      "
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
    <n-space>
      <n-form-item :label="t('tools.base64-string-converter.texts.label-decode-url-safe')" label-placement="left">
        <n-switch v-model:value="decodeUrlSafe" />
      </n-form-item>
      <c-select
        :label="t('tools.base64-string-converter.texts.text-encoding')"
        label-position="left"
        style="width: 400px"
        v-model:value="encoding"
        :options="encodings"
        searchable
      />
    </n-space>
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
