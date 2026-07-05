<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import 'webcrypto-liner-shim';
import * as openpgp from 'openpgp';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';
import { useITStorage } from '@/composable/queryParams';

const { t } = useI18n();

openpgp.config.rejectCurves = new Set();

function isWindowSecureContext() {
  return window.isSecureContext;
}

const bits = ref(4096);
const username = ref('');
const useremail = ref('');
const password = ref('');

const format = useITStorage('pgp-key-pair-generator:format', isWindowSecureContext() ? 'curve25519' : 'p256');

const formats = isWindowSecureContext()
  ? [
      'rsa',
      'curve25519',
      'curve448',
      'ed25519',
      'p256', 'p384', 'p521',
      'brainpoolP256r1', 'brainpoolP384r1', 'brainpoolP512r1',
      'secp256k1',
    ]
  : [
      'p256', 'p384', 'p521',
      'brainpoolP256r1', 'brainpoolP384r1', 'brainpoolP512r1',
      'secp256k1',
    ];

const { attrs: bitsValidationAttrs } = useValidation({
  source: bits,
  rules: [
    {
      message: 'Bits should be 256 <= bits <= 16384 and be a multiple of 8',
      validator: value => value >= 256 && value <= 16384 && value % 8 === 0,
    },
  ],
});

const [certs, refreshCerts] = computedRefreshableAsync(
  async () => {
    const formatValue = format.value;
    const passphrase = password.value;
    const name = username.value;
    const email = useremail.value;
    const rsaBits = bits.value;

    try {
      if (format.value === 'rsa') {
        const { privateKey, publicKey } = await openpgp.generateKey({
          type: 'rsa', // Type of the key
          rsaBits, // RSA key size (defaults to 4096 bits)
          userIDs: [{ name, email }], // you can pass multiple user IDs
          passphrase, // protects the private key
          format: 'armored',
        });

        return { privateKey, publicKey, revocationCertificate: '' };
      }

      const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
        type: format.value === 'curve448' ? 'curve448' : 'ecc', // Type of the key, defaults to ECC
        curve: formatValue as openpgp.EllipticCurveName, // ECC curve name, defaults to curve25519
        userIDs: [{ name, email }], // you can pass multiple user IDs
        passphrase, // protects the private key
        format: 'armored',
      });
      return { privateKey, publicKey, revocationCertificate };
    }
    catch (e: any) {
      return { privateKey: `#${e.toString()}`, publicKey: `#${e.toString()}`, revocationCertificate: '' };
    }
  }, { privateKey: '', publicKey: '', revocationCertificate: '' },
);
</script>

<template>
  <div>
    <div mb-4>
      <c-alert v-if="!isWindowSecureContext()" mb-2>
        {{ t('tools.pgp-keygen.texts.tag-your-browser-is-not-in') }}<n-a href="https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts" target="_blank">
          {{ t('tools.pgp-keygen.texts.tag-secure-context-https') }}
        </n-a>{{ t('tools.pgp-keygen.texts.tag-this-tool-may-not-work-correctly-and-require-https-to-work-fully') }}
      </c-alert>
      <div style="flex: 0 0 100%">
        <div item-style="flex: 1 1 0" style="max-width: 600px" mx-auto flex gap-3>
          <c-select
            v-model:value="format"
            label-position="left"
            :label="t('tools.pgp-keygen.texts.label-format')"
            :options="formats"
            :placeholder="t('tools.pgp-keygen.texts.placeholder-select-a-key-format')"
            style="min-width: 150px"
          />

          <n-form-item v-if="format === 'rsa'" :label="t('tools.pgp-keygen.texts.label-rsa-bits')" v-bind="bitsValidationAttrs as any" label-placement="left">
            <n-input-number-i18n v-model:value="bits" min="256" max="16384" step="8" />
          </n-form-item>
        </div>
      </div>
    </div>

    <div>
      <n-form-item :label="t('tools.pgp-keygen.texts.label-user-name')" label-placement="left">
        <n-input
          v-model:value="username"
          type="text"
          :placeholder="t('tools.pgp-keygen.texts.placeholder-user-name')"
        />
      </n-form-item>
      <n-form-item :label="t('tools.pgp-keygen.texts.label-user-email')" label-placement="left">
        <n-input
          v-model:value="useremail"
          :input-props="{ type: 'email' }"
          :placeholder="t('tools.pgp-keygen.texts.placeholder-user-email')"
        />
      </n-form-item>

      <n-form-item :label="t('tools.pgp-keygen.texts.label-passphrase')" label-placement="left">
        <n-input
          v-model:value="password"
          type="password"
          show-password-on="mousedown"
          :placeholder="t('tools.pgp-keygen.texts.placeholder-passphrase')"
        />
      </n-form-item>

      <div text-center>
        <c-button @click="refreshCerts">
          {{ t('tools.pgp-keygen.texts.tag-refresh-key-pair') }}
        </c-button>
      </div>
    </div>

    <div>
      <h3>{{ t('tools.pgp-keygen.texts.tag-public-key') }}</h3>
      <TextareaCopyable :value="certs?.publicKey || ''" :word-wrap="true" />
    </div>

    <div>
      <h3>{{ t('tools.pgp-keygen.texts.tag-private-key') }}</h3>
      <TextareaCopyable :value="certs?.privateKey || ''" :word-wrap="true" />
    </div>

    <div>
      <h3>{{ t('tools.pgp-keygen.texts.tag-revocation-certificate') }}</h3>
      <TextareaCopyable :value="certs?.revocationCertificate || ''" :word-wrap="true" />
    </div>
  </div>
</template>
