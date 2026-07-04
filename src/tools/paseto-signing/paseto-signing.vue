<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { generateKeys, sign, verify } from 'paseto-ts/v4';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const payload = ref(`{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": "${(new Date()).toISOString()}"
}`);
const footer = ref('{}');

const secretKey = ref('');
const publicKey = ref('');
const addExp = ref(true);
const addIat = ref(true);
const validatePayload = ref(true);

function generateKeyPairs() {
  const keys = generateKeys('public');
  secretKey.value = keys.secretKey;
  publicKey.value = keys.publicKey;
}
generateKeyPairs();

const signedToken = computedAsync(async () => {
  const secretKeyValue = secretKey.value;
  const payloadValue = payload.value;
  const addExpValue = addExp.value;
  const addIatValue = addIat.value;
  const footerValue = footer.value;
  const validatePayloadValue = validatePayload.value;
  try {
    const token = await sign(
      secretKeyValue,
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
      message: t('tools.paseto-signing.texts.message-invalid-json-string'),
      validator: value => JSON5.parse(value),
    },
  ],
});
const jsonFooterValidation = useValidation({
  source: footer,
  rules: [
    {
      message: t('tools.paseto-signing.texts.message-invalid-json-string'),
      validator: value => JSON5.parse(value),
    },
  ],
});

const token = ref('');
const verifiedToken = computedAsync(async () => {
  const publicKeyValue = publicKey.value;
  const tokenValue = token.value;
  const validatePayloadValue = validatePayload.value;
  try {
    // generic type parameter is optional but will give you type safety on the payload
    const { payload, footer } = await verify<any>(
      publicKeyValue,
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
    <c-card :title="t('tools.paseto-signing.texts.title-key-pairs')" mb-2>
      <c-input-text
        v-model:value="secretKey"
        :label="t('tools.paseto-signing.texts.label-secret-key')"
        label-position="left"
        :placeholder="t('tools.paseto-signing.texts.placeholder-paserk-secret-key-k4-secret-xxxx')"
        mb-1
      />
      <c-input-text
        v-model:value="publicKey"
        :label="t('tools.paseto-signing.texts.label-public-key')"
        label-position="left"
        :placeholder="t('tools.paseto-signing.texts.placeholder-paserk-public-key-k4-public-xxxx')"
        mb-1
      />
      <div flex justify-center>
        <n-button @click="generateKeyPairs()">
          {{ t('tools.paseto-signing.texts.tag-refresh-key') }}
        </n-button>
      </div>
    </c-card>

    <c-card :title="t('tools.paseto-signing.texts.title-signing')" mb-2>
      <c-input-text
        v-model:value="payload"
        :label="t('tools.paseto-signing.texts.label-payload')"
        multiline
        rows="5"
        autosize
        :placeholder="t('tools.paseto-signing.texts.placeholder-json-payload')"
        :validation="jsonInputValidation"
      />
      <n-space justify="center">
        <n-form-item :label="t('tools.paseto-signing.texts.label-validate-payload')" label-placement="left">
          <n-switch v-model:value="validatePayload" />
        </n-form-item>
        <n-form-item :label="t('tools.paseto-signing.texts.label-add-exp')" label-placement="left">
          <n-switch v-model:value="addExp" />
        </n-form-item>
        <n-form-item :label="t('tools.paseto-signing.texts.label-add-iat')" label-placement="left">
          <n-switch v-model:value="addIat" />
        </n-form-item>
      </n-space>

      <c-input-text
        v-model:value="footer"
        :label="t('tools.paseto-signing.texts.label-footer')"
        multiline
        rows="2"
        autosize
        :placeholder="t('tools.paseto-signing.texts.placeholder-json-footer')"
        :validation="jsonFooterValidation"
      />

      <c-card v-if="signedToken" :title="t('tools.paseto-signing.texts.title-signed-paserk-token')" mb-2>
        <textarea-copyable v-if="signedToken.token" :value="signedToken.token" word-wrap />
        <c-alert v-if="signedToken.error">
          {{ signedToken.error }}
        </c-alert>
      </c-card>
    </c-card>

    <c-card :title="t('tools.paseto-signing.texts.title-verifying')" mb-2>
      <c-input-text
        v-model:value="token"
        :label="t('tools.paseto-signing.texts.label-token')"
        multiline
        rows="5"
        autosize
        :placeholder="t('tools.paseto-signing.texts.placeholder-paserk-token')"
      />
      <n-space justify="center">
        <n-form-item :label="t('tools.paseto-signing.texts.label-validate-payload')" label-placement="left">
          <n-switch v-model:value="validatePayload" />
        </n-form-item>
      </n-space>

      <c-card v-if="verifiedToken" :title="t('tools.paseto-signing.texts.title-verification-result')" mb-2>
        <n-form-item v-if="verifiedToken.payload" :label="t('tools.paseto-signing.texts.label-payload')">
          <textarea-copyable :value="JSON.stringify(verifiedToken.payload, null, 2)" word-wrap />
        </n-form-item>
        <n-form-item v-if="verifiedToken.footer" :label="t('tools.paseto-signing.texts.label-footer')">
          <textarea-copyable :value="JSON.stringify(verifiedToken.footer, null, 2)" word-wrap />
        </n-form-item>
        <c-alert v-if="verifiedToken.error">
          {{ verifiedToken.error }}
        </c-alert>
      </c-card>
    </c-card>
  </div>
</template>
