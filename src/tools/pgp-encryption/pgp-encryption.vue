<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import 'webcrypto-liner-shim';
import * as openpgp from 'openpgp';
import { computedCatchAsync } from '@/composable/computed/catchedComputed';

const { t } = useI18n();

openpgp.config.rejectCurves = new Set();

const cryptInput = ref('');
const cryptPublicKey = ref('');
const cryptPrivateKey = ref('');
const cryptPrivateKeyPassphrase = ref('');
const [cryptOutput, cryptError] = computedCatchAsync(async () => {
  const publicKeyArmored = cryptPublicKey.value;
  const privateKeyArmored = cryptPrivateKey.value;
  const passphrase = cryptPrivateKeyPassphrase.value;
  const text = cryptInput.value;

  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

  const privateKey = privateKeyArmored !== ''
    ? (passphrase !== ''
        ? await openpgp.decryptKey({
          privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
          passphrase,
        })
        : await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }))
    : undefined;

  return await openpgp.encrypt({
    message: await openpgp.createMessage({ text }),
    encryptionKeys: publicKey,
    signingKeys: privateKey,
  });
}, {
  defaultValue: '',
  defaultErrorMessage: 'Unable to encrypt your text',
});

const decryptInput = ref('');
const decryptPublicKey = ref('');
const decryptPrivateKey = ref('');
const decryptPrivateKeyPassphrase = ref('');
const [decryptOutput, decryptError] = computedCatchAsync(async () => {
  const publicKeyArmored = decryptPublicKey.value;
  const privateKeyArmored = decryptPrivateKey.value;
  const passphrase = decryptPrivateKeyPassphrase.value;
  const encrypted = decryptInput.value;

  const publicKey = publicKeyArmored !== '' ? await openpgp.readKey({ armoredKey: publicKeyArmored }) : undefined;

  const privateKey = passphrase !== ''
    ? await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
      passphrase,
    })
    : await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });

  const message = await openpgp.readMessage({
    armoredMessage: encrypted, // parse armored message
  });
  const { data: decrypted, signatures } = await openpgp.decrypt({
    message,
    verificationKeys: publicKey, // optional
    decryptionKeys: privateKey,
  });
  if (signatures.length > 0) {
    try {
      await signatures[0].verified; // throws on invalid signature
    }
    catch (e: any) {
      return {
        decryptedText: decrypted,
        signatureError: `Signature could not be verified: ${e.toString()}`,
      };
    }
  }
  return {
    decryptedText: decrypted,
    signatureError: '',
  };
}, {
  defaultValue: { decryptedText: '', signatureError: '' },
  defaultErrorMessage: 'Unable to encrypt your text',
});

function isWindowSecureContext() {
  return window.isSecureContext;
}
</script>

<template>
  <div>
    <c-alert v-if="!isWindowSecureContext()" mb-2>
      {{ t('tools.pgp-encryption.texts.tag-your-browser-is-not-in') }}<n-a href="https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts" target="_blank">
        {{ t('tools.pgp-encryption.texts.tag-secure-context-https') }}
      </n-a>{{ t('tools.pgp-encryption.texts.tag-this-tool-may-not-work-correctly-and-require-https-to-work-fully') }}
    </c-alert>
    <c-card :title="t('tools.pgp-encryption.texts.title-encrypt')" mb-2>
      <div>
        <c-input-text
          v-model:value="cryptInput"
          :label="t('tools.pgp-encryption.texts.label-your-text')"
          :placeholder="t('tools.pgp-encryption.texts.placeholder-the-string-to-encrypt')"
          rows="4"
          multiline raw-text monospace autosize flex-1
        />
        <div flex flex-1 flex-col gap-2>
          <c-input-text
            v-model:value="cryptPublicKey"
            :label="t('tools.pgp-encryption.texts.label-target-public-key')"
            :placeholder="t('tools.pgp-encryption.texts.placeholder-target-public-key')"
            rows="5"
            multiline raw-text monospace autosize flex-1
          />

          <details>
            <summary>{{ t('tools.pgp-encryption.texts.tag-signing-private-key-optional') }}</summary>
            <c-input-text
              v-model:value="cryptPrivateKey"
              :label="t('tools.pgp-encryption.texts.label-your-private-key')"
              :placeholder="t('tools.pgp-encryption.texts.placeholder-the-private-key-to-use-to-sign-message')"
              rows="5"
              multiline raw-text monospace autosize flex-1
            />

            <c-input-text
              v-model:value="cryptPrivateKeyPassphrase"
              :label="t('tools.pgp-encryption.texts.label-your-private-key-password')" clearable raw-text
            />
          </details>
        </div>
      </div>

      <c-alert
        v-if="cryptError && cryptPublicKey !== ''"
        type="error" mt-12 :title="t('tools.pgp-encryption.texts.title-error-while-encrypting')"
      >
        {{ cryptError }}
      </c-alert>

      <n-form-item :label="t('tools.pgp-encryption.texts.label-your-text-encrypted')" mt-3>
        <TextareaCopyable
          :value="cryptOutput || ''"
          rows="3"
          :placeholder="t('tools.pgp-encryption.texts.placeholder-your-string-encrypted')"
          multiline monospace readonly autosize mt-5
        />
      </n-form-item>
    </c-card>

    <c-card :title="t('tools.pgp-encryption.texts.title-decrypt')">
      <div>
        <c-input-text
          v-model:value="decryptInput"
          :label="t('tools.pgp-encryption.texts.label-your-pgp-message-to-decrypt')"
          :placeholder="t('tools.pgp-encryption.texts.placeholder-the-string-to-decrypt')"
          rows="4"
          multiline raw-text monospace autosize flex-1
        />
        <div flex flex-1 flex-col gap-2>
          <c-input-text
            v-model:value="decryptPrivateKey"
            :label="t('tools.pgp-encryption.texts.label-your-private-key')"
            :placeholder="t('tools.pgp-encryption.texts.placeholder-the-private-key-to-use-to-decrypt-message')"
            rows="5"
            multiline raw-text monospace autosize flex-1
          />

          <c-input-text
            v-model:value="decryptPrivateKeyPassphrase"
            :label="t('tools.pgp-encryption.texts.label-your-private-key-password')" clearable raw-text
          />

          <details>
            <summary>{{ t('tools.pgp-encryption.texts.tag-signing-public-key-optional') }}</summary>

            <c-input-text
              v-model:value="decryptPublicKey"
              :label="t('tools.pgp-encryption.texts.label-sender-public-key')"
              :placeholder="t('tools.pgp-encryption.texts.placeholder-sender-public-key')"
              rows="5"
              multiline raw-text monospace autosize flex-1
            />
          </details>
        </div>
      </div>

      <c-alert v-if="decryptError && decryptPrivateKey !== ''" type="error" mt-3 :title="t('tools.pgp-encryption.texts.title-error-while-decrypting')">
        {{ decryptError }}
      </c-alert>

      <c-alert v-if="decryptOutput?.signatureError !== ''" type="error" mt-3 :title="t('tools.pgp-encryption.texts.title-signature-verification')">
        {{ decryptOutput?.signatureError }}
      </c-alert>

      <n-form-item :label="t('tools.pgp-encryption.texts.label-your-text-decrypted')" mt-3>
        <TextareaCopyable
          :value="decryptOutput?.decryptedText || ''"
          rows="3"
          :placeholder="t('tools.pgp-encryption.texts.placeholder-your-string-decrypted')"
          multiline monospace readonly autosize mt-5
        />
      </n-form-item>
    </c-card>
  </div>
</template>
