<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type sshpk from 'sshpk';
import { generateKeyPair } from './ecdsa-key-pair-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

const { t } = useI18n();

const password = ref('');
const comment = ref('');
const emptyCerts = { publicKey: '', privateKey: '' };
const curve = useStorage('ecdsa-key-pair-generator:curve', 'nistp256');
const curveOptions = [
  { value: 'nistp256', label: t('tools.ecdsa-key-pair-generator.texts.label-nistp256') },
  { value: 'nistp384', label: t('tools.ecdsa-key-pair-generator.texts.label-nistp384') },
  { value: 'nistp521', label: t('tools.ecdsa-key-pair-generator.texts.label-nistp521') },
];

const format = useStorage('ecdsa-key-pair-generator:format', 'ssh');
const formatOptions = [
  { value: 'pem', label: t('tools.ecdsa-key-pair-generator.texts.label-pem') },
  { value: 'pkcs8', label: t('tools.ecdsa-key-pair-generator.texts.label-pkcs-8') },
  { value: 'ssh', label: t('tools.ecdsa-key-pair-generator.texts.label-openssh-standard') },
  { value: 'openssh', label: t('tools.ecdsa-key-pair-generator.texts.label-openssh-new') },
  { value: 'putty', label: t('tools.ecdsa-key-pair-generator.texts.label-putty') },
];

const supportsPassphrase = computed(() => format.value === 'ssh');
const [certs, refreshCerts] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(() => generateKeyPair(
    {
      password: password.value,
      format: format.value as sshpk.PrivateKeyFormatType,
      curve: curve.value as sshpk.CurveType,
      comment: comment.value,
    },
  ), emptyCerts),
  emptyCerts,
);
</script>

<template>
  <div>
    <n-space mb-1>
      <c-select
        v-model:value="format"
        label-position="left"
        :label="t('tools.ecdsa-key-pair-generator.texts.label-format')"
        :options="formatOptions"
        :placeholder="t('tools.ecdsa-key-pair-generator.texts.placeholder-select-a-key-format')"
      />

      <c-select
        v-model:value="curve"
        label-position="left"
        :label="t('tools.ecdsa-key-pair-generator.texts.label-curve')"
        :options="curveOptions"
        :placeholder="t('tools.ecdsa-key-pair-generator.texts.placeholder-select-a-curve-type')"
      />
    </n-space>

    <div v-if="supportsPassphrase" mb-1 mt-3>
      <n-form-item :label="t('tools.ecdsa-key-pair-generator.texts.label-passphrase')" label-placement="left">
        <n-input
          v-model:value="password"
          type="password"
          show-password-on="mousedown"
          :placeholder="t('tools.ecdsa-key-pair-generator.texts.placeholder-passphrase')"
        />
      </n-form-item>
    </div>

    <div mb-2>
      <n-form-item :label="t('tools.ecdsa-key-pair-generator.texts.label-comment')" label-placement="left">
        <n-input
          v-model:value="comment"
          type="text"
          :placeholder="t('tools.ecdsa-key-pair-generator.texts.placeholder-comment')"
        />
      </n-form-item>
    </div>

    <n-space justify="center" mb-1>
      <c-button @click="refreshCerts">
        {{ t('tools.ecdsa-key-pair-generator.texts.tag-refresh-key-pair') }}
      </c-button>
    </n-space>

    <n-divider />

    <div>
      <h3>{{ t('tools.ecdsa-key-pair-generator.texts.tag-public-key') }}</h3>
      <TextareaCopyable :value="certs.publicKey" :word-wrap="true" />
    </div>

    <div>
      <h3>{{ t('tools.ecdsa-key-pair-generator.texts.tag-private-key') }}</h3>
      <TextareaCopyable :value="certs.privateKey" />
    </div>
  </div>
</template>
