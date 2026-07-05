<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import * as openpgp from 'openpgp';

const { t } = useI18n();

const message = useMessage();

const file = ref<File | null>(null);
const publicKeyArmored = ref('');
const privateKeyArmored = ref('');
const passphrase = ref('');

const error = ref('');

const encryptedBlob = ref<Blob | null>(null);
const decryptedBlob = ref<Blob | null>(null);

const encryptProgress = ref(0);
const decryptProgress = ref(0);

const loadingEncrypt = ref(false);
const loadingDecrypt = ref(false);

function onUpload(uploadedFile: File) {
  file.value = uploadedFile ?? null;
  encryptedBlob.value = null;
  decryptedBlob.value = null;
  encryptProgress.value = 0;
  decryptProgress.value = 0;
}

async function encryptStream() {
  if (!file.value) {
    return message.error('Select a file first.');
  }
  if (!publicKeyArmored.value.trim()) {
    return message.error('Public key required.');
  }

  loadingEncrypt.value = true;
  encryptProgress.value = 0;
  encryptedBlob.value = null;
  error.value = '';

  try {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored.value });

    const fileStream = file.value.stream(); // native browser stream
    const messageObj = await openpgp.createMessage({ binary: fileStream });

    const encryptedStream = await openpgp.encrypt({
      message: messageObj,
      encryptionKeys: publicKey,
      format: 'binary',
    });

    const reader = encryptedStream.getReader();
    const chunks: Uint8Array[] = [];
    let processed = 0;
    const total = file.value.size;

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      chunks.push(value);
      processed += value.length;
      encryptProgress.value = Math.round((processed / total) * 100);
    }

    encryptedBlob.value = new Blob(chunks, { type: 'application/octet-stream' });
    message.success('File encrypted.');
  }
  catch (err: any) {
    error.value = err.toString();
    message.error('Encryption failed.');
  }
  finally {
    loadingEncrypt.value = false;
  }
}

async function decryptStream() {
  if (!file.value && !encryptedBlob.value) {
    return message.error('Select an encrypted file first.');
  }

  if (!privateKeyArmored.value.trim()) {
    return message.error('Private key required.');
  }

  loadingDecrypt.value = true;
  decryptProgress.value = 0;
  decryptedBlob.value = null;
  error.value = '';

  try {
    const privateKey = await openpgp.readPrivateKey({
      armoredKey: privateKeyArmored.value,
    });

    const unlockedKey = passphrase.value
      ? await openpgp.decryptKey({
        privateKey,
        passphrase: passphrase.value,
      })
      : privateKey;

    const source = encryptedBlob.value ?? file.value!;
    const encryptedStream = source.stream();

    const messageObj = await openpgp.readMessage({
      binaryMessage: encryptedStream,
    });

    const { data: decryptedStream } = await openpgp.decrypt({
      message: messageObj,
      decryptionKeys: unlockedKey,
      format: 'binary',
    });

    const reader = decryptedStream.getReader();
    const chunks: Uint8Array[] = [];
    let processed = 0;
    const total = source.size;

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      chunks.push(value);
      processed += value.length;
      decryptProgress.value = Math.round((processed / total) * 100);
    }

    decryptedBlob.value = new Blob(chunks, { type: 'application/octet-stream' });
    message.success('File decrypted.');
  }
  catch (err: any) {
    error.value = err.toString();
    message.error('Decryption failed.');
  }
  finally {
    loadingDecrypt.value = false;
  }
}

function downloadBlob(blob: Blob | null, filename: string) {
  if (!blob) {
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div>
    <NCard :title="t('tools.pgp-file-encryption.texts.title-1-select-a-file')" mb-1>
      <c-file-upload
        :title="t('tools.pgp-file-encryption.texts.title-drag-and-drop-a-file-or-click-to-select')"
        mb-1
        @file-upload="onUpload"
      />
      <NSpace v-if="file" justify="center">
        <NText>{{ t('tools.pgp-file-encryption.texts.tag-selected-file') }}</NText>
        <NText strong>
          {{ file?.name }}
        </NText>
      </NSpace>
    </NCard>

    <NCard :title="t('tools.pgp-file-encryption.texts.title-2-public-key-for-encryption')" mb-1>
      <c-input-text v-model:value="publicKeyArmored" multiline rows="6" />
    </NCard>

    <NCard :title="t('tools.pgp-file-encryption.texts.title-3-private-key-passphrase-for-decryption')">
      <c-input-text v-model:value="privateKeyArmored" multiline rows="6" mb-1 />
      <NFormItem :label="t('tools.pgp-file-encryption.texts.label-passphrase')" label-placement="left">
        <NInput v-model:value="passphrase" type="password" show-password-on="click" :placeholder="t('tools.pgp-file-encryption.texts.placeholder-passphrase')" />
      </NFormItem>
    </NCard>

    <!-- Actions -->
    <NSpace justify="center" mb-1>
      <NButton :disabled="!file || !publicKeyArmored" type="primary" :loading="loadingEncrypt" mr-2 @click="encryptStream">
        {{ t('tools.pgp-file-encryption.texts.tag-encrypt-stream') }}
      </NButton>

      <NButton :disabled="!file || !privateKeyArmored" type="primary" :loading="loadingDecrypt" @click="decryptStream">
        {{ t('tools.pgp-file-encryption.texts.tag-decrypt-stream') }}
      </NButton>
    </NSpace>

    <!-- Progress -->
    <div v-if="loadingEncrypt" mb-1 text-center>
      <NText>{{ t('tools.pgp-file-encryption.texts.tag-encrypting') }}</NText>
      <NProgress type="line" :percentage="encryptProgress" />
    </div>

    <div v-if="loadingDecrypt" mb-1 text-center>
      <NText>{{ t('tools.pgp-file-encryption.texts.tag-decrypting') }}</NText>
      <NProgress type="line" :percentage="decryptProgress" />
    </div>

    <c-alert v-if="error" mb-1>
      {{ error }}
    </c-alert>

    <div v-if="encryptedBlob">
      <NAlert type="success" mb-1>
        {{ t('tools.pgp-file-encryption.texts.tag-encrypted-file-ready') }}
      </NAlert>
      <NSpace justify="center">
        <NButton size="small" @click="downloadBlob(encryptedBlob, `${file?.name || 'file'}.pgp`)">
          {{ t('tools.pgp-file-encryption.texts.tag-download-encrypted') }}
        </NButton>
      </NSpace>
    </div>

    <div v-if="decryptedBlob">
      <NAlert type="success" mb-1>
        {{ t('tools.pgp-file-encryption.texts.tag-decrypted-file-ready') }}
      </NAlert>
      <NSpace justify="center">
        <NButton size="small" @click="downloadBlob(decryptedBlob, `decrypted-${((file?.name || 'file').replace(/\.pgp$/, ''))}`)">
          {{ t('tools.pgp-file-encryption.texts.tag-download-decrypted') }}
        </NButton>
      </NSpace>
    </div>
  </div>
</template>
