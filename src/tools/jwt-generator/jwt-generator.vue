<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import * as jose from 'jose';
import { type KeyLike } from 'jose';
import JSON5 from 'json5';
import hexArray from 'hex-array';
import { Base64 } from 'js-base64';
import { type JwtPayload, jwtDecode } from 'jwt-decode';
import { getJwtAlgorithm } from '../jwt-parser/jwt-parser.service';
import { jwsAlgorithms } from './jwt-generator.constants';

import { useValidation } from '@/composable/validation';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const payload = ref(`{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}`);

const alg = useQueryParamOrStorage({ name: 'alg', storageName: 'jwt-gen:alg', defaultValue: 'HS512' });
const algInfo = computed(() => jwsAlgorithms.find(a => a.alg === alg.value) || { alg: 'UNK', keyDesc: '', key: 'secret', verify: '' });
const isSecret = computed(() => algInfo.value.key === 'secret');

const inputToken = ref('');
const inputTokenError = ref('');
watch(inputToken, (value) => {
  inputTokenError.value = '';
  try {
    payload.value = JSON.stringify(jwtDecode<JwtPayload>(value), null, 2);
    alg.value = getJwtAlgorithm({ jwt: value }) || 'HS512';
  }
  catch (e: any) {
    inputTokenError.value = e.toString();
  }
});

const secret = ref('');
const secretEncoding = ref<'text' | 'base64' | 'hex'>('text');
const encodings = [
  { label: t('tools.jwt-generator.texts.label-raw-text'), value: 'text' },
  { label: t('tools.jwt-generator.texts.label-hex-array'), value: 'hex' },
  { label: 'Base64', value: 'base64' },
];

const publicKeyPEM = ref('');
const publicKeyJWK = ref('');
const privateKeyJWK = ref('');
const privateKeyPEM = ref('');

watch(publicKeyPEM, async (newValue) => {
  try {
    publicKeyJWK.value = JSON.stringify(await jose.exportJWK(await jose.importSPKI(newValue, alg.value, { extractable: true })), null, 2);
  }
  catch {
  }
}, { immediate: true });
watch(privateKeyPEM, async (newValue) => {
  try {
    privateKeyJWK.value = JSON.stringify(await jose.exportJWK(await jose.importPKCS8(newValue, alg.value, { extractable: true })), null, 2);
  }
  catch {
  }
}, { immediate: true });
watch(publicKeyJWK, async (newValue) => {
  try {
    publicKeyPEM.value = await jose.exportSPKI(await jose.importJWK({ ...JSON.parse(newValue), ...{ ext: true } }, alg.value) as KeyLike);
  }
  catch {
  }
}, { immediate: true });
watch(privateKeyJWK, async (newValue) => {
  try {
    privateKeyPEM.value = await jose.exportPKCS8(await jose.importJWK({ ...JSON.parse(newValue), ...{ ext: true } }, alg.value) as KeyLike);
  }
  catch {
  }
}, { immediate: true });

watchEffect(async () => {
  if (isSecret.value) {
    secret.value = 'your-secret';
    privateKeyJWK.value = '';
    publicKeyJWK.value = '';
    privateKeyPEM.value = '';
    publicKeyPEM.value = '';
  }
  else {
    const { publicKey, privateKey } = await jose.generateKeyPair(alg.value, { extractable: true });
    privateKeyJWK.value = JSON.stringify(await jose.exportJWK(privateKey), null, 2);
    publicKeyJWK.value = JSON.stringify(await jose.exportJWK(publicKey), null, 2);
    privateKeyPEM.value = await jose.exportPKCS8(privateKey);
    publicKeyPEM.value = await jose.exportSPKI(publicKey);
  }
});

const header = computed(() => JSON.stringify({ alg: alg.value, typ: 'JWT' }, null, 2));
const encodedJWT = computedAsync(async () => {
  const isSecretValue = isSecret.value;
  const secretValue = secret.value;
  const secretEncodingValue = secretEncoding.value;
  const privateKeyValue = privateKeyJWK.value;
  const algValue = alg.value;
  const payloadValue = payload.value;
  try {
    let privateKeyOrSecret;
    if (isSecretValue) {
      try {
        switch (secretEncodingValue) {
          case 'text':
            privateKeyOrSecret = new TextEncoder().encode(secretValue);
            break;
          case 'hex':
            privateKeyOrSecret = hexArray.fromString(secretValue);
            break;
          case 'base64':
            if (!Base64.isValid(secretValue)) {
              throw new Error(t('tools.jwt-generator.texts.invalid-base64-string'));
            }
            privateKeyOrSecret = Base64.toUint8Array(secretValue);
            break;
        }
      }
      catch (parseError: any) {
        throw new Error(t('tools.jwt-generator.texts.cannot-parse-secret-as-encoding', [secretValue, secretEncodingValue, parseError]));
      }
    }
    else {
      privateKeyOrSecret = await jose.importJWK(JSON.parse(privateKeyValue), algValue);
    }
    return {
      token: await (new jose.SignJWT(JSON5.parse(payloadValue))
        .setProtectedHeader({ alg: algValue })
        .sign(privateKeyOrSecret)),
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
      message: t('tools.jwt-generator.texts.message-invalid-json-string'),
      validator: value => JSON5.parse(value),
    },
  ],
});
</script>

<template>
  <div>
    <c-card mb-3>
      <details>
        <summary>
          {{ t('tools.jwt-generator.texts.click-to-input-a-existing-jwt-token-to-modify') }}
        </summary>
        <c-input-text
          v-model:value="inputToken"
          :placeholder="t('tools.jwt-generator.texts.placeholder-input-token')"
        />
        <c-alert v-if="inputTokenError">
          {{ inputTokenError }}
        </c-alert>
      </details>
    </c-card>

    <c-select
      v-model:value="alg"
      :options="jwsAlgorithms.map(a => ({ value: a.alg, label: `${a.alg}: ${a.verify}` }))"
      :placeholder="t('tools.jwt-generator.texts.placeholder-algorithms')"
      mb-2
    />
    <n-form-item :label="t('tools.jwt-generator.texts.label-description')" label-placement="left" mb-2>
      {{ t('tools.jwt-generator.texts.verify-description', [algInfo.alg, algInfo.keyDesc, algInfo.verify]) }}
    </n-form-item>

    <c-card :title="t('tools.jwt-generator.texts.title-token-content')" mb-2>
      <n-form-item :label="t('tools.jwt-generator.texts.label-header')">
        <textarea-copyable :value="header" language="json" />
      </n-form-item>

      <c-input-text
        v-model:value="payload"
        :label="t('tools.jwt-generator.texts.label-payload')"
        multiline
        rows="5"
        autosize
        :placeholder="t('tools.jwt-generator.texts.placeholder-json-payload')"
        :validation="jsonInputValidation"
      />
    </c-card>

    <c-card :title="isSecret ? t('tools.jwt-generator.texts.token-secret') : t('tools.jwt-generator.texts.token-keys')" mb-2>
      <div v-if="isSecret">
        <c-select
          v-model:value="secretEncoding"
          label-placement="left"
          :label="t('tools.jwt-generator.texts.label-secret-encoding')"
          :options="encodings"
          mb-2
        />
        <c-input-text v-model:value="secret" />
      </div>
      <div v-else>
        <n-form-item :label="t('tools.jwt-generator.texts.label-public-key-pem')">
          <c-input-text
            v-model:value="publicKeyPEM"
            multiline
            rows="5"
            autosize
          />
        </n-form-item>
        <n-form-item :label="t('tools.jwt-generator.texts.label-private-key-pem')">
          <c-input-text
            v-model:value="privateKeyPEM"
            multiline
            rows="5"
            autosize
          />
        </n-form-item>

        <n-divider />

        <n-form-item :label="t('tools.jwt-generator.texts.label-public-key-jwk')">
          <c-input-text
            v-model:value="publicKeyJWK"
            multiline
            rows="5"
            autosize
          />
        </n-form-item>
        <n-form-item :label="t('tools.jwt-generator.texts.label-private-key-jwk')">
          <c-input-text
            v-model:value="privateKeyJWK"
            multiline
            rows="5"
            autosize
          />
        </n-form-item>
      </div>
    </c-card>

    <c-card v-if="encodedJWT" :title="t('tools.jwt-generator.texts.title-generated-jwt-token')" mb-2>
      <textarea-copyable v-if="encodedJWT.token" :value="encodedJWT.token" word-wrap />
      <c-alert v-if="encodedJWT.error">
        {{ encodedJWT.error }}
      </c-alert>
    </c-card>
  </div>
</template>
