<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { type Encoding, convertTextToUnicode, convertUnicodeToText } from './text-to-unicode.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();

const encoding = useQueryParamOrStorage({ name: 'enc', storageName: 'txt-uni:enc', defaultValue: 'htmldec' });
const skipAscii = useQueryParamOrStorage({ name: 'skipAscii', storageName: 'txt-uni:asc', defaultValue: true });

const inputText = ref('');
const unicodeFromText = computed(() => inputText.value.trim() === ''
  ? ''
  : convertTextToUnicode(inputText.value, { encoding: encoding.value as Encoding, skipAscii: skipAscii.value }));
const { copy: copyUnicode } = useCopy({ source: unicodeFromText });

const inputUnicode = ref('');
const textFromUnicode = computed(() => inputUnicode.value.trim() === ''
  ? ''
  : convertUnicodeToText(inputUnicode.value));
const { copy: copyText } = useCopy({ source: textFromUnicode });
</script>

<template>
  <c-card :title="t('tools.text-to-unicode.texts.title-text-to-unicode')">
    <c-select
      v-model:value="encoding"
      :label="t('tools.text-to-unicode.texts.label-unicode-encoding')"
      :options="[
        { value: 'htmldec', label: t('tools.text-to-unicode.texts.label-html-decimal-amp-160') },
        { value: 'htmlhex', label: t('tools.text-to-unicode.texts.label-html-hexadecimal-amp-xa0') },
        { value: 'uniplus', label: t('tools.text-to-unicode.texts.label-u-00a0') },
        { value: 'antiuni', label: t('tools.text-to-unicode.texts.label-u00a0') },
        { value: 'css', label: t('tools.text-to-unicode.texts.label-css-0000a0') },
        { value: 'python', label: t('tools.text-to-unicode.texts.label-python-xa0-u00a0-u100a0') },
        { value: 'js', label: t('tools.text-to-unicode.texts.label-python-u00a0-u-100a0') },
        { value: 'utf16', label: t('tools.text-to-unicode.texts.label-utf-16-with-surrogates') },
      ]"
    />
    <n-form-item>
      <n-checkbox v-model:checked="skipAscii">
        {{ t('tools.text-to-unicode.texts.tag-skip-ascii-characters') }}
      </n-checkbox>
    </n-form-item>

    <c-input-text v-model:value="inputText" multiline :placeholder="t('tools.text-to-unicode.texts.placeholder-e-g-hello-avengers')" :label="t('tools.text-to-unicode.texts.label-enter-text-to-convert-to-unicode')" autosize autofocus raw-text test-id="text-to-unicode-input" />
    <c-input-text v-model:value="unicodeFromText" :label="t('tools.text-to-unicode.texts.label-unicode-from-your-text')" multiline raw-text readonly mt-2 :placeholder="t('tools.text-to-unicode.texts.placeholder-the-unicode-representation-of-your-text-will-be-here')" test-id="text-to-unicode-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!unicodeFromText" @click="copyUnicode()">
        {{ t('tools.text-to-unicode.texts.tag-copy-unicode-to-clipboard') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.text-to-unicode.texts.title-unicode-to-text')">
    <c-input-text v-model:value="inputUnicode" multiline :placeholder="t('tools.text-to-unicode.texts.placeholder-input-unicode')" :label="t('tools.text-to-unicode.texts.label-enter-unicode-to-convert-to-text')" autosize raw-text test-id="unicode-to-text-input" />
    <c-input-text v-model:value="textFromUnicode" :label="t('tools.text-to-unicode.texts.label-text-from-your-unicode')" multiline raw-text readonly mt-2 :placeholder="t('tools.text-to-unicode.texts.placeholder-the-text-representation-of-your-unicode-will-be-here')" test-id="unicode-to-text-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!textFromUnicode" @click="copyText()">
        {{ t('tools.text-to-unicode.texts.tag-copy-text-to-clipboard') }}
      </c-button>
    </div>
  </c-card>
</template>
