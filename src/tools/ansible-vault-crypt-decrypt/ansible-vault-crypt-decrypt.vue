<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Vault } from 'ansible-vault';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const decryptedInput = ref('');
const encryptPassword = ref('');
const encryptId = ref('');
const cryptedOutput = computedAsync(
  async () => {
    try {
      const v = new Vault({ password: encryptPassword.value });
      return await v.encrypt(decryptedInput.value, encryptId.value);
    }
    catch (e: any) {
      return e.toString();
    }
  },
);

const cryptedInput = ref('');
const decryptPassword = ref('');
const decryptedOutput = computedAsync(
  async () => {
    try {
      const v = new Vault({ password: decryptPassword.value });
      // handle mac \r
      return (await v.decrypt(cryptedInput.value?.replace(/\r(?!\n)/, '\n'), undefined)) ?? '';
    }
    catch (e: any) {
      return e.toString();
    }
  },
);
</script>

<template>
  <c-card :title="t('tools.ansible-vault-crypt-decrypt.texts.title-encrypt-ansible-vault-secret')">
    <c-input-text
      v-model:value="decryptedInput"
      :placeholder="t('tools.ansible-vault-crypt-decrypt.texts.placeholder-put-your-string-to-encrypt')"
      :label="t('tools.ansible-vault-crypt-decrypt.texts.label-string-to-encrypt')"
      raw-text
      mb-5
    />

    <n-space>
      <c-input-text
        v-model:value="encryptPassword"
        :placeholder="t('tools.ansible-vault-crypt-decrypt.texts.placeholder-encryption-password')"
        :label="t('tools.ansible-vault-crypt-decrypt.texts.label-encryption-password')"
        raw-text
        mb-5
      />
      <c-input-text
        v-model:value="encryptId"
        :placeholder="t('tools.ansible-vault-crypt-decrypt.texts.placeholder-encryption-id')"
        :label="t('tools.ansible-vault-crypt-decrypt.texts.label-encryption-id')"
        raw-text
        mb-5
      />
    </n-space>

    <n-divider />

    <TextareaCopyable
      :label="t('tools.ansible-vault-crypt-decrypt.texts.label-encrypted-string')"
      :value="cryptedOutput"
      multiline
      readonly
      rows="5"
      mb-5
    />
  </c-card>

  <c-card :title="t('tools.ansible-vault-crypt-decrypt.texts.title-decrypt-ansible-vault-secret')">
    <c-input-text
      v-model:value="cryptedInput"
      :placeholder="t('tools.ansible-vault-crypt-decrypt.texts.placeholder-put-your-encrypted-string-here')"
      :label="t('tools.ansible-vault-crypt-decrypt.texts.label-string-to-decrypt')"
      raw-text multiline mb-5
      rows="5"
    />

    <c-input-text
      v-model:value="decryptPassword"
      :placeholder="t('tools.ansible-vault-crypt-decrypt.texts.placeholder-decryption-password')"
      :label="t('tools.ansible-vault-crypt-decrypt.texts.label-decryption-password')"
      raw-text
      mb-5
    />

    <n-divider />

    <TextareaCopyable
      :label="t('tools.ansible-vault-crypt-decrypt.texts.label-decrypted-string')"
      :value="decryptedOutput"
      multiline
      readonly
      rows="5"
      mb-5
    />
  </c-card>
</template>
