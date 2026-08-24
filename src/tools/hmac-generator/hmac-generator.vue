<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { Encoding } from '../hash-text/hash-text.service';
import type { AlgoNames, KeyEncoding } from './hmac-generator.service';
import { algos, computeHmac } from './hmac-generator.service';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();

const plainText = ref('');
const secret = ref('');
const hashFunction = ref<AlgoNames>('SHA256');
const encoding = ref<Encoding>('Hex');
const keyEncoding = ref<KeyEncoding>('Text');
const hmac = computed(() =>
  computeHmac({
    plainText: plainText.value,
    secret: secret.value,
    hashFunction: hashFunction.value,
    keyEncoding: keyEncoding.value,
    encoding: encoding.value,
  }),
);
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
