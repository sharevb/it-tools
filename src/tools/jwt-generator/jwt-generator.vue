<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import * as jose from 'jose';
import { type KeyLike } from 'jose';
import JSON5 from 'json5';
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

const secret = ref('');

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
  const privateKeyValue = privateKeyJWK.value;
  const algValue = alg.value;
  const payloadValue = payload.value;
  try {
    let privateKeyOrSecret;
    if (isSecretValue) {
      privateKeyOrSecret = new TextEncoder().encode(secretValue);
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
    <c-select
      v-model:value="alg"
      :options="jwsAlgorithms.map(a => ({ value: a.alg, label: `${a.alg}: ${a.verify}` }))"
      :placeholder="t('tools.jwt-generator.texts.placeholder-algorithms')"
      mb-2
    />
    <n-form-item :label="t('tools.jwt-generator.texts.label-description')" label-placement="left" mb-2>
      {{ algInfo.alg }}: {{ algInfo.keyDesc }} (verify with {{ algInfo.verify }})
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

    <c-card :title="isSecret ? 'Token Secret' : 'Token Keys'" mb-2>
      <c-input-text v-if="isSecret" v-model:value="secret" />

      <div v-if="!isSecret">
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
