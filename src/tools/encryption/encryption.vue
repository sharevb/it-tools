<script setup lang="ts">
import type { KeyEncoding } from './encryption.service';
import { algos } from './encryption.service';
import { computedCatch } from '@/composable/computed/catchedComputed';

const { t } = useI18n();

const cypherInput = ref('Lorem ipsum dolor sit amet');
const cypherAlgo = ref<keyof typeof algos>('AES-CBC');
const cypherSecret = ref('my secret key 16');
const cypherSecretEncoding = ref<KeyEncoding>('Text');
const [cypherOutput, cypherError] = computedCatch(() => algos[cypherAlgo.value].encrypt(cypherInput.value, cypherSecret.value, cypherSecretEncoding.value), {
  defaultValue: '',
  defaultErrorMessage: t('tools.encryption.defaultErrorMessage'),
});

const decryptInput = ref('dopEIE7v5TJlhHl+0+mA4Q+BxNj4xcdTsiVGw4tmpLlkDln8lzmzavO3egJuzpCD');
const decryptAlgo = ref<keyof typeof algos>('AES-CBC');
const decryptSecret = ref('my secret key 16');
const decryptSecretEncoding = ref<KeyEncoding>('Text');
const [decryptOutput, decryptError] = computedCatch(() => algos[decryptAlgo.value].decrypt(decryptInput.value, decryptSecret.value, decryptSecretEncoding.value), {
  defaultValue: '',
  defaultErrorMessage: t('tools.encryption.defaultErrorMessage'),
});
</script>

<template>
  <c-card :title="t('tools.encryption.title-encrypt')">
    <div flex gap-3>
      <c-input-text
        v-model:value="cypherInput"
        :label="t('tools.encryption.texts.label-your-text')"
        :placeholder="t('tools.encryption.texts.placeholder-the-string-to-cypher')"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="cypherSecret" :label="t('tools.encryption.texts.label-your-secret-key')" clearable raw-text />

        <c-select
          v-model:value="cypherSecretEncoding" :label="t('tools.encryption.texts.label-key-encoding')"
          flex-1
          :placeholder="t('tools.encryption.texts.placeholder-select-the-key-encoding')"
          :options="[
            {
              label: t('tools.encryption.texts.label-plain-text'),
              value: 'Text',
            },
            {
              label: t('tools.encryption.texts.label-hexadecimal-text'),
              value: 'Hex',
            },
          ]"
        />

        <c-select
          v-model:value="cypherAlgo"
          :label="t('tools.encryption.texts.label-encryption-algorithm')"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-alert v-if="cypherError" type="error" mt-12 :title="t('tools.encryption.texts.title-error-while-cyphering')">
      {{ cypherError }}
    </c-alert>
    <c-input-text
      :label="t('tools.encryption.texts.label-your-text-encrypted')"
      :value="cypherOutput"
      rows="3"
      :placeholder="t('tools.encryption.texts.placeholder-your-string-hash')"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
  <c-card :title="t('tools.encryption.title-decrypt')">
    <div flex gap-3>
      <c-input-text
        v-model:value="decryptInput"
        :label="t('tools.encryption.texts.label-your-encrypted-text')"
        :placeholder="t('tools.encryption.texts.placeholder-the-string-to-cypher')"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="decryptSecret" :label="t('tools.encryption.texts.label-your-secret-key')" clearable raw-text />

        <c-select
          v-model:value="decryptSecretEncoding" :label="t('tools.encryption.texts.label-key-encoding')"
          flex-1
          :placeholder="t('tools.encryption.texts.placeholder-select-the-key-encoding')"
          :options="[
            {
              label: t('tools.encryption.texts.label-plain-text'),
              value: 'Text',
            },
            {
              label: t('tools.encryption.texts.label-hexadecimal-text'),
              value: 'Hex',
            },
          ]"
        />

        <c-select
          v-model:value="decryptAlgo"
          :label="t('tools.encryption.texts.label-encryption-algorithm')"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-alert v-if="decryptError" type="error" mt-12 :title="t('tools.encryption.texts.title-error-while-decrypting')">
      {{ decryptError }}
    </c-alert>
    <c-input-text
      v-else
      :label="t('tools.encryption.texts.label-your-decrypted-text')"
      :value="decryptOutput"
      :placeholder="t('tools.encryption.texts.placeholder-your-string-hash')"
      rows="3"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
</template>
