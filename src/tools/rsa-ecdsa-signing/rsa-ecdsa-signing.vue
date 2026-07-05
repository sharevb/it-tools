<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import sshpk from 'sshpk';
import { computedCatch } from '@/composable/computed/catchedComputed';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const hashTypes = [
  'sha1', 'sha256', 'sha384', 'sha512', 'md5',
];

const verifyText = ref('');
const verifySignature = ref('');
const verifyPublicKey = ref('');
const [verifyOutput, verifyError] = computedCatch(() => {
  const publicKey = sshpk.parseKey(verifyPublicKey.value, 'auto');

  const v = publicKey.createVerify();
  v.update(verifyText.value);
  return v.verify(verifySignature.value);
}, {
  defaultValue: '',
  defaultErrorMessage: 'Unable to verify your text',
});

const signText = ref('');
const signPrivateKey = ref('');
const signPrivateKeyPassphrase = ref('');
const signHashType = ref('sha1');
const [signOutput, signError] = computedCatch(() => {
  const privateKey = sshpk.parsePrivateKey(signPrivateKey.value, 'auto', { passphrase: signPrivateKeyPassphrase.value });
  const s = privateKey.createSign(signHashType.value as sshpk.AlgorithmHashType);
  s.update(signText.value);
  const signature = s.sign();
  return {
    asn1: signature.toString('asn1'),
    ssh: signature.toString('ssh'),
  };
}, {
  defaultValue: {
    asn1: '',
    ssh: '',
  },
  defaultErrorMessage: 'Unable to sign your text',
});
</script>

<template>
  <div>
    <c-card :title="t('tools.rsa-ecdsa-signing.texts.title-sign')">
      <div>
        <c-input-text
          v-model:value="signText"
          :label="t('tools.rsa-ecdsa-signing.texts.label-your-text')"
          :placeholder="t('tools.rsa-ecdsa-signing.texts.placeholder-the-string-to-sign')"
          rows="4"
          multiline raw-text monospace autosize flex-1
        />
        <c-select
          v-model:value="signHashType"
          :label="t('tools.rsa-ecdsa-signing.texts.label-hash-type')"
          :options="hashTypes"
          :placeholder="t('tools.rsa-ecdsa-signing.texts.placeholder-select-the-hashing-algorithm')"
        />
        <div flex flex-1 flex-col gap-2>
          <c-input-text
            v-model:value="signPrivateKey"
            :label="t('tools.rsa-ecdsa-signing.texts.label-your-private-key')"
            :placeholder="t('tools.rsa-ecdsa-signing.texts.placeholder-the-private-key-to-use-to-sign-message')"
            rows="5"
            multiline raw-text monospace autosize flex-1
          />

          <c-input-text
            v-model:value="signPrivateKeyPassphrase"
            :label="t('tools.rsa-ecdsa-signing.texts.label-your-private-key-password')" clearable raw-text
          />
        </div>
      </div>

      <c-alert v-if="signError && signPrivateKey !== ''" type="error" mt-12 :title="t('tools.rsa-ecdsa-signing.texts.title-error-while-signing')">
        {{ signError }}
      </c-alert>

      <n-form-item :label="t('tools.rsa-ecdsa-signing.texts.label-asn1-signature')" mt-3>
        <TextareaCopyable
          :value="signOutput?.asn1 || ''"
          :placeholder="t('tools.rsa-ecdsa-signing.texts.placeholder-asn1-signature')"
          multiline monospace readonly autosize mt-5
        />
      </n-form-item>
      <n-form-item :label="t('tools.rsa-ecdsa-signing.texts.label-ssh-signature')" mt-3>
        <TextareaCopyable
          :value="signOutput?.ssh || ''"
          :placeholder="t('tools.rsa-ecdsa-signing.texts.placeholder-ssg-signature')"
          multiline monospace readonly autosize mt-5
        />
      </n-form-item>
    </c-card>

    <c-card :title="t('tools.rsa-ecdsa-signing.texts.title-verify')">
      <div>
        <c-input-text
          v-model:value="verifyText"
          :label="t('tools.rsa-ecdsa-signing.texts.label-your-text-to-verify')"
          :placeholder="t('tools.rsa-ecdsa-signing.texts.placeholder-the-string-to-verify')"
          rows="4"
          multiline raw-text monospace autosize flex-1
        />

        <c-input-text
          v-model:value="verifySignature"
          :label="t('tools.rsa-ecdsa-signing.texts.label-associated-signature')"
          :placeholder="t('tools.rsa-ecdsa-signing.texts.placeholder-text-signature')"
          rows="4"
          multiline raw-text monospace autosize flex-1
        />

        <div flex flex-1 flex-col gap-2>
          <c-input-text
            v-model:value="verifyPublicKey"
            :label="t('tools.rsa-ecdsa-signing.texts.label-public-key')"
            :placeholder="t('tools.rsa-ecdsa-signing.texts.placeholder-public-key')"
            rows="5"
            multiline raw-text monospace autosize flex-1
          />
        </div>
      </div>

      <c-alert v-if="verifyError && verifyPublicKey !== ''" type="error" mt-12 :title="t('tools.rsa-ecdsa-signing.texts.title-error-while-verifying')">
        {{ verifyError }}
      </c-alert>
      <c-alert v-if="verifyOutput && verifyPublicKey !== ''" type="error" mt-12 :title="t('tools.rsa-ecdsa-signing.texts.title-signature-failed')">
        {{ t('tools.rsa-ecdsa-signing.texts.tag-signature-is-not-valid-for-the-given-text') }}
      </c-alert>
      <n-alert v-if="!verifyOutput && verifyPublicKey !== ''" type="success" mt-12 :title="t('tools.rsa-ecdsa-signing.texts.title-signature-verified')">
        {{ t('tools.rsa-ecdsa-signing.texts.tag-signature-is-valid-for-the-given-text') }}
      </n-alert>
    </c-card>
  </div>
</template>
