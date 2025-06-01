<script setup lang="ts">
import { useScriptTag } from '@vueuse/core';
import ageWasmUrl from '/age-wasm/age.wasm?url';

declare global {
  interface Window {
    generateX25519Identity: () => {
      privateKey: string
      publicKey: string
    }
    encrypt: (publicKeys: string, message: string) => {
      error?: string
      output: string
    }
    decrypt: (privateKeys: string, message: string) => {
      error?: string
      output: string
    }
    encryptBinary: (publicKeys: string, buffer: Uint8Array) => string | Uint8Array
    decryptBinary: (privateKeys: string, buffer: Uint8Array) => string | Uint8Array
  }
}
/**
 * Go is the class as defined in the Golang `wasm_exec.js` distributable file required for WebAssembly.
 * Golang WebAssembly wiki: https://github.com/golang/go/wiki/WebAssembly
 */
declare class Go {
  argv: string[];
  env: { [envKey: string]: string };
  exit: (code: number) => void;
  importObject: WebAssembly.Imports;
  exited: boolean;
  mem: DataView;
  run(instance: WebAssembly.Instance): Promise<void>;
}

const { load: loadGo } = useScriptTag('/age-wasm/wasm_exec.js', undefined, { type: 'module', manual: true });

await loadGo();

const go = new Go();
const result = await WebAssembly.instantiateStreaming(fetch(ageWasmUrl), go.importObject);
go.run(result.instance);

const privKey = ref('');
const pubKey = ref('');
const recipients = ref('');
const message = ref('');
const encryptedOutput = ref('');
const recipientsBinary = ref('');
const filesEncrypt = ref<File[]>([]);
const identities = ref('');
const encryptedText = ref('');
const decryptedOutput = ref('');
const identitiesBinary = ref('');
const filesDecrypt = ref<File[]>([]);
const error = ref('');

function downloadURL(data: string, fileName: string) {
  const a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = 'none';
  a.click();
  a.remove();
}

function downloadBlob(data: Uint8Array, fileName: string) {
  const blob = new Blob([data], {
    type: 'application/octet-stream',
  });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

function generateKeys() {
  const keys = window.generateX25519Identity();
  privKey.value = keys.privateKey;
  pubKey.value = keys.publicKey;
}

function encrypt() {
  error.value = '';
  const result = window.encrypt(recipients.value, message.value);
  if (result.error) {
    error.value = result.error;
  }
  else {
    encryptedOutput.value = result.output;
  }
}

function encryptBinary() {
  error.value = '';
  const file = filesEncrypt.value;
  if (!file.length) {
    return;
  }

  file.forEach((f) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result as ArrayBuffer);
      const result = window.encryptBinary(recipientsBinary.value, buffer);
      if (typeof result === 'string') {
        error.value = result;
      }
      else {
        downloadBlob(result, `${f.name}.age`);
      }
    };
    reader.readAsArrayBuffer(f);
  });

  filesEncrypt.value = [];
}

function decrypt() {
  error.value = '';
  const result = window.decrypt(identities.value, encryptedText.value);
  if (result.error) {
    error.value = result.error;
  }
  else {
    decryptedOutput.value = result.output;
  }
}

function decryptBinary() {
  error.value = '';
  const file = filesDecrypt.value;
  if (!file.length) {
    return;
  }

  file.forEach((f) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result as ArrayBuffer);
      const result = window.decryptBinary(identitiesBinary.value, buffer);
      if (typeof result === 'string') {
        error.value = result;
      }
      else {
        downloadBlob(result, f.name.replace('.age', ''));
      }
    };
    reader.readAsArrayBuffer(f);
  });

  filesDecrypt.value = [];
}

function onEncryptFilesUploaded(uploadedFiles: File[]) {
  filesEncrypt.value = uploadedFiles;
}
function onDecryptFilesUploaded(uploadedFiles: File[]) {
  filesDecrypt.value = uploadedFiles;
}
</script>

<template>
  <n-tabs type="card">
    <!-- Generate Keys -->
    <n-tab-pane name="keys" tab="Generate Keys">
      <n-card title="Private Key" mb-1>
        <textarea-copyable v-model:value="privKey" rows="3" multiline placeholder="Your private key will be generated here." />
      </n-card>
      <n-card title="Public Key" mb-1>
        <textarea-copyable v-model:value="pubKey" rows="3" multiline placeholder="Your public key will be generated here." />
      </n-card>
      <n-button type="primary" @click="generateKeys">
        Generate Keys
      </n-button>
    </n-tab-pane>

    <!-- Encrypt Text -->
    <n-tab-pane name="encrypt" tab="Encrypt">
      <n-card title="Public Keys" mb-1>
        <n-input v-model:value="recipients" type="textarea" placeholder="Recipient key or keys one per line" required />
      </n-card>
      <n-card title="Message" mb-1>
        <n-input v-model:value="message" type="textarea" placeholder="Message to encrypt" required />
      </n-card>
      <n-card title="Output" mb-1>
        <textarea-copyable v-model:value="encryptedOutput" rows="3" multiline placeholder="Encrypted output will be generated here." />
      </n-card>
      <n-button type="primary" @click="encrypt">
        Encrypt
      </n-button>
    </n-tab-pane>

    <!-- Encrypt Binary -->
    <n-tab-pane name="encryptBinary" tab="Encrypt Binary">
      <n-card title="Public Keys" mb-1>
        <n-input v-model:value="recipientsBinary" type="textarea" placeholder="Recipient key or keys one per line" required />
      </n-card>
      <n-card title="Files" mb-1>
        <c-file-upload
          title="Drag and drop files here, or click to select some files"
          multiple
          @files-upload="onEncryptFilesUploaded"
        />
        <ul>
          <li v-for="(file, index) in filesEncrypt" :key="index">
            {{ file.name }}
          </li>
        </ul>
      </n-card>
      <n-card title="Output" mb-1>
        <p>The encrypted files will be downloaded.</p>
      </n-card>
      <n-button type="primary" @click="encryptBinary">
        Encrypt Binary
      </n-button>
    </n-tab-pane>

    <!-- Decrypt Text -->
    <n-tab-pane name="decrypt" tab="Decrypt">
      <n-card title="Private Keys" mb-1>
        <n-input v-model:value="identities" type="textarea" placeholder="Identity key or keys one per line" required />
      </n-card>
      <n-card title="Encrypted Text" mb-1>
        <n-input v-model:value="encryptedText" type="textarea" placeholder="Paste here encrypted text" required />
      </n-card>
      <n-card title="Output" mb-1>
        <textarea-copyable v-model:value="decryptedOutput" rows="3" multiline placeholder="Decrypted output will be generated here." />
      </n-card>
      <n-button type="primary" @click="decrypt">
        Decrypt
      </n-button>
    </n-tab-pane>

    <!-- Decrypt Binary -->
    <n-tab-pane name="decryptBinary" tab="Decrypt Binary">
      <n-card title="Private Keys" mb-1>
        <n-input v-model:value="identitiesBinary" type="textarea" placeholder="Identity key or keys one per line" required />
      </n-card>
      <n-card title="Encrypted Files" mb-1>
        <c-file-upload
          title="Drag and drop files here, or click to select some files"
          multiple
          @files-upload="onDecryptFilesUploaded"
        />
        <ul>
          <li v-for="(file, index) in filesDecrypt" :key="index">
            {{ file.name }}
          </li>
        </ul>
      </n-card>
      <n-card title="Output" mb-1>
        <p>The decrypted files will be downloaded.</p>
      </n-card>
      <n-button type="primary" @click="decryptBinary">
        Decrypt Binary
      </n-button>
    </n-tab-pane>
  </n-tabs>
</template>
