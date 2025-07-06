<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { decrypt, encrypt, generateKeys } from 'paseto-ts/v4';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const payload = ref(`{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": "${(new Date()).toISOString()}"
}`);
const footer = ref('{}');

const localKey = ref('');
const addExp = ref(true);
const addIat = ref(true);
const validatePayload = ref(true);

function generateLocalKey() {
  localKey.value = generateKeys('local');
}
generateLocalKey();

const encryptedToken = computedAsync(async () => {
  const localKeyValue = localKey.value;
  const payloadValue = payload.value;
  const addExpValue = addExp.value;
  const addIatValue = addIat.value;
  const footerValue = footer.value;
  const validatePayloadValue = validatePayload.value;
  try {
    const token = await encrypt(
      localKeyValue,
      payloadValue,
      {
        addExp: addExpValue,
        addIat: addIatValue,
        footer: footerValue,
        validatePayload: validatePayloadValue,
      },
    );
    return {
      token,
      error: '',
    };
  }
  catch (e: any) {
    return { error: e.toString(), token: '' };
  }
});

const jsonInputValidation = useValidation({
  source: payload,
  rules: [
    {
      message: t('tools.paseto-encryption.texts.message-invalid-json-string'),
      validator: value => JSON5.parse(value),
    },
  ],
});
const jsonFooterValidation = useValidation({
  source: footer,
  rules: [
    {
      message: t('tools.paseto-encryption.texts.message-invalid-json-string'),
      validator: value => JSON5.parse(value),
    },
  ],
});

const token = ref('');
const decryptedToken = computedAsync(async () => {
  const localKeyValue = localKey.value;
  const tokenValue = token.value;
  const validatePayloadValue = validatePayload.value;
  try {
    // generic type parameter is optional but will give you type safety on the payload
    const { payload, footer } = await decrypt<any>(
      localKeyValue,
      tokenValue,
      {
        validatePayload: validatePayloadValue,
      },
    );
    return {
      payload,
      footer,
      error: '',
    };
  }
  catch (e: any) {
    return { error: e.toString(), payload: '', footer: '' };
  }
});
</script>

<template>
  <div>
    <c-card :title="t('tools.paseto-encryption.texts.title-local-key')" mb-2>
      <c-input-text
        v-model:value="localKey"
        :label="t('tools.paseto-encryption.texts.label-local-key')"
        label-position="left"
        :placeholder="t('tools.paseto-encryption.texts.placeholder-paserk-local-key-k4-local-xxxx')"
        mb-2
      />
      <div flex justify-center>
        <n-button @click="generateLocalKey()">
          {{ t('tools.paseto-encryption.texts.tag-refresh-key') }}
        </n-button>
      </div>
    </c-card>

    <c-card :title="t('tools.paseto-encryption.texts.title-encryption')" mb-2>
      <c-input-text
        v-model:value="payload"
        :label="t('tools.paseto-encryption.texts.label-payload')"
        multiline
        rows="5"
        autosize
        :placeholder="t('tools.paseto-encryption.texts.placeholder-json-payload')"
        :validation="jsonInputValidation"
      />
      <n-space justify="center">
        <n-form-item :label="t('tools.paseto-encryption.texts.label-validate-payload')" label-placement="left">
          <n-switch v-model:value="validatePayload" />
        </n-form-item>
        <n-form-item :label="t('tools.paseto-encryption.texts.label-add-exp')" label-placement="left">
          <n-switch v-model:value="addExp" />
        </n-form-item>
        <n-form-item :label="t('tools.paseto-encryption.texts.label-add-iat')" label-placement="left">
          <n-switch v-model:value="addIat" />
        </n-form-item>
      </n-space>

      <c-input-text
        v-model:value="footer"
        :label="t('tools.paseto-encryption.texts.label-footer')"
        multiline
        rows="2"
        autosize
        :placeholder="t('tools.paseto-encryption.texts.placeholder-json-footer')"
        :validation="jsonFooterValidation"
        mb-2
      />

      <c-card v-if="encryptedToken" :title="t('tools.paseto-encryption.texts.title-generated-paserk-token')" mb-2>
        <textarea-copyable v-if="encryptedToken.token" :value="encryptedToken.token" word-wrap />
        <c-alert v-if="encryptedToken.error">
          {{ encryptedToken.error }}
        </c-alert>
      </c-card>
    </c-card>

    <c-card :title="t('tools.paseto-encryption.texts.title-decryption')" mb-2>
      <c-input-text
        v-model:value="token"
        :label="t('tools.paseto-encryption.texts.label-token')"
        multiline
        rows="5"
        autosize
        :placeholder="t('tools.paseto-encryption.texts.placeholder-paserk-token')"
      />
      <n-space justify="center">
        <n-form-item :label="t('tools.paseto-encryption.texts.label-validate-payload')" label-placement="left">
          <n-checkbox v-model:checked="validatePayload" />
        </n-form-item>
      </n-space>

      <c-card v-if="decryptedToken" :title="t('tools.paseto-encryption.texts.title-decoded-paserk')" mb-2>
        <n-form-item v-if="decryptedToken.payload" :label="t('tools.paseto-encryption.texts.label-payload')">
          <textarea-copyable :value="JSON.stringify(decryptedToken.payload, null, 2)" word-wrap />
        </n-form-item>
        <n-form-item v-if="decryptedToken.footer" :label="t('tools.paseto-encryption.texts.label-footer')">
          <textarea-copyable :value="JSON.stringify(decryptedToken.footer, null, 2)" word-wrap />
        </n-form-item>
        <c-alert v-if="decryptedToken.error">
          {{ decryptedToken.error }}
        </c-alert>
      </c-card>
    </c-card>
  </div>
</template>
