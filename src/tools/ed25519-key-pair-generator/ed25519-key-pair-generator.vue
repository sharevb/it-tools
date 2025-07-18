<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type sshpk from 'sshpk';
import { generateKeyPair } from './ed25519-key-pair-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

const { t } = useI18n();

const password = ref('');
const comment = ref('');
const emptyCerts = { publicKey: '', privateKey: '' };

const format = useStorage('ed25519-key-pair-generator:format', 'ssh');
const formatOptions = [
  { value: 'pem', label: t('tools.ed25519-key-pair-generator.texts.label-pem') },
  { value: 'pkcs8', label: t('tools.ed25519-key-pair-generator.texts.label-pkcs-8') },
  { value: 'ssh', label: t('tools.ed25519-key-pair-generator.texts.label-openssh-standard') },
  { value: 'openssh', label: t('tools.ed25519-key-pair-generator.texts.label-openssh-new') },
  { value: 'putty', label: t('tools.ed25519-key-pair-generator.texts.label-putty') },
];

const supportsPassphrase = computed(() => format.value === 'ssh');

const [certs, refreshCerts] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(() => generateKeyPair(
    {
      password: password.value,
      format: format.value as sshpk.PrivateKeyFormatType,
      comment: comment.value,
    },
  ), emptyCerts),
  emptyCerts,
);
</script>

<template>
  <div>
    <n-space mb-2>
      <c-select
        v-model:value="format"
        label-position="left"
        :label="t('tools.ed25519-key-pair-generator.texts.label-format')"
        :options="formatOptions"
        :placeholder="t('tools.ed25519-key-pair-generator.texts.placeholder-select-a-key-format')"
      />

      <n-form-item v-if="supportsPassphrase" :label="t('tools.ed25519-key-pair-generator.texts.label-passphrase')" label-placement="left">
        <n-input
          v-model:value="password"
          type="password"
          show-password-on="mousedown"
          :placeholder="t('tools.ed25519-key-pair-generator.texts.placeholder-passphrase')"
        />
      </n-form-item>
    </n-space>

    <n-space mb-2>
      <n-form-item :label="t('tools.ed25519-key-pair-generator.texts.label-comment')" label-placement="left">
        <n-input
          v-model:value="comment"
          type="text"
          :placeholder="t('tools.ed25519-key-pair-generator.texts.placeholder-comment')"
        />
      </n-form-item>

      <c-button @click="refreshCerts">
        {{ t('tools.ed25519-key-pair-generator.texts.tag-refresh-key-pair') }}
      </c-button>
    </n-space>

    <div>
      <h3>{{ t('tools.ed25519-key-pair-generator.texts.tag-public-key') }}</h3>
      <TextareaCopyable :value="certs.publicKey" :word-wrap="true" />
    </div>

    <div>
      <h3>{{ t('tools.ed25519-key-pair-generator.texts.tag-private-key') }}</h3>
      <TextareaCopyable :value="certs.privateKey" />
    </div>
  </div>
</template>
