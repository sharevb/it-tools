<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { NForm, NFormItem, NInput, NSelect } from 'naive-ui';
import { generateKeyPair } from '../rsa-key-pair-generator/rsa-key-pair-generator.service';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

const { t } = useI18n();

const domain = ref('');
const selector = ref('default');
const keySize = ref('2048');
const password = ref('');

const keySizes = [
  { label: t('tools.dkim-dns-generator.texts.label-1024-bit-less-secure-but-faster'), value: '1024' },
  { label: t('tools.dkim-dns-generator.texts.label-2048-bit-recommended-for-security'), value: '2048' },
  { label: t('tools.dkim-dns-generator.texts.label-4096-bit-stronger-security-but-slower'), value: '4096' },
];

const emptyCerts = { publicKey: '', privateKey: '' };
const [certs, refreshCerts] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(() => generateKeyPair({
    bits: Number(keySize.value),
    password: password.value,
    format: 'pem',
  }), emptyCerts),
  emptyCerts,
);

const dKIMRecord = computed(() => {
  if (!domain.value || !selector.value) {
    return '';
  }

  const pubKey = certs.value.publicKey.replace(/-----(BEGIN|END) PUBLIC KEY-----|\s/g, '');
  const parts = [
    'v=DKIM1',
    'k=rsa',
    `p=${pubKey}`,
  ];

  const record = parts.join('; ');
  return `${selector.value}._domainkey.${domain.value} IN TXT "${record}"`;
});
</script>

<template>
  <NForm label-placement="top">
    <NFormItem :label="t('tools.dkim-dns-generator.texts.label-domain-name')">
      <NInput v-model:value="domain" :placeholder="t('tools.dkim-dns-generator.texts.placeholder-enter-domain-e-g-example-com')" />
    </NFormItem>

    <NFormItem :label="t('tools.dkim-dns-generator.texts.label-selector-unique-name-used-to-distinguish-dkim-records-for-the-same-domain')">
      <NInput v-model:value="selector" :placeholder="t('tools.dkim-dns-generator.texts.placeholder-enter-selector-e-g-default')" />
    </NFormItem>

    <NFormItem :label="t('tools.dkim-dns-generator.texts.label-key-size-of-the-rsa-key-used-for-signing-emails')">
      <NSelect v-model:value="keySize" :options="keySizes" :placeholder="t('tools.dkim-dns-generator.texts.placeholder-select-key-size')" />
    </NFormItem>

    <NFormItem :label="t('tools.dkim-dns-generator.texts.label-passphrase-of-private-key')">
      <NInput
        v-model:value="password"
        type="password"
        show-password-on="mousedown"
        :placeholder="t('tools.dkim-dns-generator.texts.placeholder-passphrase')"
      />
    </NFormItem>

    <div mb-2 flex justify-center>
      <n-button @click="refreshCerts()">
        {{ t('tools.dkim-dns-generator.texts.tag-refresh-certificate') }}
      </n-button>
    </div>

    <c-card :title="t('tools.dkim-dns-generator.texts.title-generate-dkim-record')" mb-1>
      <textarea-copyable :value="dKIMRecord" />
    </c-card>

    <c-card v-if="dKIMRecord" :title="t('tools.dkim-dns-generator.texts.title-rsa-public-key')" mb-1>
      <textarea-copyable :value="certs.publicKey" />
    </c-card>

    <c-card v-if="dKIMRecord" :title="t('tools.dkim-dns-generator.texts.title-pem-rsa-private-key')">
      <textarea-copyable :value="certs.privateKey" />
    </c-card>
  </NForm>
</template>
