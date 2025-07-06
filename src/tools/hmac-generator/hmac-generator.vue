<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { lib } from 'crypto-js';
import {
  HmacMD5,
  HmacRIPEMD160,
  HmacSHA1,
  HmacSHA224,
  HmacSHA256,
  HmacSHA3,
  HmacSHA384,
  HmacSHA512,
  enc,
} from 'crypto-js';

import { convertHexToBin } from '../hash-text/hash-text.service';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();

const algos = {
  MD5: HmacMD5,
  RIPEMD160: HmacRIPEMD160,
  SHA1: HmacSHA1,
  SHA3: HmacSHA3,
  SHA224: HmacSHA224,
  SHA256: HmacSHA256,
  SHA384: HmacSHA384,
  SHA512: HmacSHA512,
} as const;

type Encoding = keyof typeof enc | 'Bin';
type KeyEncoding = 'Text' | 'Hex';

function formatWithEncoding(words: lib.WordArray, encoding: Encoding) {
  if (encoding === 'Bin') {
    return convertHexToBin(words.toString(enc.Hex));
  }
  return words.toString(enc[encoding]);
}

const plainText = ref('');
const secret = ref('');
const hashFunction = ref<keyof typeof algos>('SHA256');
const encoding = ref<Encoding>('Hex');
const keyEncoding = ref<KeyEncoding>('Text');
const hmac = computed(() => {
  // normalize secret according to the key encoding
  const key = keyEncoding.value === 'Text' ? secret.value : enc.Hex.parse(secret.value);
  return formatWithEncoding(algos[hashFunction.value](plainText.value, key), encoding.value);
});
const { copy } = useCopy({ source: hmac });
</script>

<template>
  <div flex flex-col gap-4>
    <c-input-text v-model:value="plainText" multiline raw-text :placeholder="t('tools.hmac-generator.texts.placeholder-plain-text-to-compute-the-hash')" rows="3" autosize autofocus :label="t('tools.hmac-generator.texts.label-plain-text-to-compute-the-hash')" />
    <div flex gap-2>
      <c-input-text v-model:value="secret" :placeholder="t('tools.hmac-generator.texts.placeholder-enter-the-secret-key')" :label="t('tools.hmac-generator.texts.label-secret-key')" raw-text clearable flex-1 />
      <c-select
        v-model:value="keyEncoding" :label="t('tools.hmac-generator.texts.label-key-encoding')"
        flex-1
        :placeholder="t('tools.hmac-generator.texts.placeholder-select-the-key-encoding')"
        :options="[
          {
            label: t('tools.hmac-generator.texts.label-plain-text'),
            value: 'Text',
          },
          {
            label: t('tools.hmac-generator.texts.label-hexadecimal-text'),
            value: 'Hex',
          },
        ]"
      />
    </div>
    <div flex gap-2>
      <c-select
        v-model:value="hashFunction" :label="t('tools.hmac-generator.texts.label-hashing-function')"
        flex-1
        :placeholder="t('tools.hmac-generator.texts.placeholder-select-an-hashing-function')"
        :options="Object.keys(algos).map((label) => ({ label, value: label }))"
      />
      <c-select
        v-model:value="encoding" :label="t('tools.hmac-generator.texts.label-output-encoding')"
        flex-1
        :placeholder="t('tools.hmac-generator.texts.placeholder-select-the-result-encoding')"
        :options="[
          {
            label: t('tools.hmac-generator.texts.label-binary-base-2'),
            value: 'Bin',
          },
          {
            label: t('tools.hmac-generator.texts.label-hexadecimal-base-16'),
            value: 'Hex',
          },
          {
            label: t('tools.hmac-generator.texts.label-base64-base-64'),
            value: 'Base64',
          },
          {
            label: t('tools.hmac-generator.texts.label-base64-url-base-64-with-url-safe-chars'),
            value: 'Base64url',
          },
        ]"
      />
    </div>
    <input-copyable v-model:value="hmac" type="textarea" :placeholder="t('tools.hmac-generator.texts.placeholder-the-result-of-the-hmac')" :label="t('tools.hmac-generator.texts.label-hmac-of-your-text')" />
    <div flex justify-center>
      <c-button @click="copy()">
        {{ t('tools.hmac-generator.texts.tag-copy-hmac') }}
      </c-button>
    </div>
  </div>
</template>
