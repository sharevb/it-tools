<script setup lang="ts">
import { Buffer } from 'node:buffer';
import { useI18n } from 'vue-i18n';

import { getKeysOrCertificatesInfosAsync } from './certificate-key-parser.service';
import { type LabelValue } from './certificate-key-parser.infos';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const inputKeyOrCertificate = ref('');
const passphrase = ref('');
const fileInput = ref() as Ref<Buffer>;
const inputType = ref<'file' | 'content'>('file');
const pemHeader = useQueryParamOrStorage({
  name: 'pemtype',
  storageName: 'cert-key-parser:t',
  defaultValue: '',
});

async function onUpload(file: File) {
  if (file) {
    fileInput.value = Buffer.from(await file.arrayBuffer());
    inputKeyOrCertificate.value = '';
  }
}

const certificateX509DER = ref('');
const { download: downloadX509DER } = useDownloadFileFromBase64(
  {
    source: certificateX509DER,
    extension: 'der',
  });

function downloadX509DERFile() {
  if (certificateX509DER.value === '') {
    return;
  }

  try {
    downloadX509DER();
  }
  catch (_) {
    //
  }
}

const parsedSections = computedAsync<LabelValue[][]>(async () => {
  const inputContent = inputKeyOrCertificate.value;
  const file = fileInput.value;
  let inputKeyOrCertificateValue: string | Buffer = '';
  if (inputType.value === 'file' && file) {
    inputKeyOrCertificateValue = file;
  }
  else if (inputType.value === 'content' && inputContent) {
    inputKeyOrCertificateValue = inputContent;
  }
  try {
    const parsed = await getKeysOrCertificatesInfosAsync(inputKeyOrCertificateValue, passphrase.value, pemHeader.value);
    if (parsed.length === 1) {
      const { values, certificateX509DER: certPEM } = parsed[0];
      certificateX509DER.value = certPEM || '';
      return [values];
    }
    else {
      return parsed.map(p => p.values);
    }
  }
  catch (e: any) {
    return [
      [{ label: t('tools.certificate-key-parser.texts.label-parsing-error'), value: e.toString() }],
    ];
  }
});

const pemHeaders = [
  { label: t('tools.certificate-key-parser.texts.autodetect'), value: '' },

  { label: t('tools.certificate-key-parser.texts.certificate-x-509'), value: 'CERTIFICATE' },
  { label: t('tools.certificate-key-parser.texts.certificate-request-csr-pkcs-10'), value: 'CERTIFICATE REQUEST' },

  { label: t('tools.certificate-key-parser.texts.private-key-pkcs-8'), value: 'PRIVATE KEY' },
  { label: t('tools.certificate-key-parser.texts.public-key-pkcs-8'), value: 'PUBLIC KEY' },
  { label: t('tools.certificate-key-parser.texts.encrypted-private-key-pkcs-8-encrypted'), value: 'ENCRYPTED PRIVATE KEY' },

  { label: t('tools.certificate-key-parser.texts.rsa-private-key-pkcs-1'), value: 'RSA PRIVATE KEY' },
  { label: t('tools.certificate-key-parser.texts.rsa-public-key-pkcs-1'), value: 'RSA PUBLIC KEY' },

  { label: t('tools.certificate-key-parser.texts.ec-private-key'), value: 'EC PRIVATE KEY' },
  { label: t('tools.certificate-key-parser.texts.ec-parameters'), value: 'EC PARAMETERS' },

  { label: t('tools.certificate-key-parser.texts.dsa-private-key'), value: 'DSA PRIVATE KEY' },
  { label: t('tools.certificate-key-parser.texts.dsa-public-key'), value: 'DSA PUBLIC KEY' },

  { label: t('tools.certificate-key-parser.texts.openssh-private-key'), value: 'OPENSSH PRIVATE KEY' },
  { label: t('tools.certificate-key-parser.texts.ssh-public-key-rfc4716'), value: 'SSH PUBLIC KEY' },

  { label: t('tools.certificate-key-parser.texts.pgp-public-key-block'), value: 'PGP PUBLIC KEY BLOCK' },
  { label: t('tools.certificate-key-parser.texts.pgp-private-key-block'), value: 'PGP PRIVATE KEY BLOCK' },
];
</script>

<template>
  <div>
    <c-card>
      <n-radio-group v-model:value="inputType" name="radiogroup" mb-2 flex justify-center>
        <n-space>
          <n-radio
            value="file"
            :label="t('tools.certificate-key-parser.texts.label-file')"
          />
          <n-radio
            value="content"
            :label="t('tools.certificate-key-parser.texts.label-content')"
          />
        </n-space>
      </n-radio-group>

      <c-file-upload
        v-if="inputType === 'file'"
        :title="t('tools.certificate-key-parser.texts.title-drag-and-drop-a-certificate-file-here-or-click-to-select-a-certificate-file')"
        @file-upload="onUpload"
      />

      <c-input-text
        v-if="inputType === 'content'"
        v-model:value="inputKeyOrCertificate"
        :label="t('tools.certificate-key-parser.texts.label-paste-your-public-key-private-key-signature-fingerprint-certificate')"
        :placeholder="t('tools.certificate-key-parser.texts.placeholder-your-public-key-private-key-signature-fingerprint-certificate')"
        multiline
        rows="8"
        data-test-id="input"
      />
    </c-card>

    <c-input-text
      v-model:value="passphrase"
      :label="t('tools.certificate-key-parser.texts.label-passphrase-for-encrypted-keys')"
      :placeholder="t('tools.certificate-key-parser.texts.placeholder-passphrase-for-encrypted-keys')"
      type="password"
      data-test-id="pass"
      label-position="left"
      mt-1
    />

    <c-select
      v-model:value="pemHeader"
      :options="pemHeaders"
      :label="t('tools.certificate-key-parser.texts.label-pem-header')"
      label-position="left"
      mt-1
    />

    <n-divider />

    <c-card
      v-for="(part, partIndex) of parsedSections"
      :key="partIndex"
      mb-2
    >
      <input-copyable
        v-for="{ label, value, multiline } of part"
        :key="label"
        :label="label"
        :data-test-id="label"
        label-position="left"
        label-width="100px"
        label-align="right"

        autosize mb-2
        :multiline="multiline"
        :value="value"
        :placeholder="t('tools.certificate-key-parser.texts.placeholder-not-set')"
      />
    </c-card>

    <div v-if="certificateX509DER !== ''" flex justify-center>
      <c-button @click="downloadX509DERFile()">
        {{ t('tools.certificate-key-parser.texts.tag-download-x509-der-certificate') }}
      </c-button>
    </div>
  </div>
</template>
