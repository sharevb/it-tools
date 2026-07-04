<script setup lang="ts">
import { Buffer } from 'node:buffer';
import { useI18n } from 'vue-i18n';
import sss from 'shamirs-secret-sharing';

const { t } = useI18n();

const secret = ref('');
const secretMode = ref<'hex' | 'utf8' | 'base64'>('utf8');
const shares = ref<string[]>([]);
const sharesError = ref('');
const threshold = ref(2);
const shareCount = ref(3);
const recombineInput = ref<string>('');
const recombinedSecret = ref('');
const recombineError = ref('');

const secretModes = [
  { value: 'utf8', label: t('tools.shamirs-secret-sharing.texts.label-text') },
  { value: 'hex', label: t('tools.shamirs-secret-sharing.texts.label-hexadecimal') },
  { value: 'base64', label: t('tools.shamirs-secret-sharing.texts.label-base64') },
];

function splitSecret() {
  if (!secret.value) {
    shares.value = [];
    return;
  }

  sharesError.value = '';
  try {
    const secretBuffer = Buffer.from(secret.value, secretMode.value);
    if (secretBuffer.length === 0) {
      throw new Error(`Cannot convert "${secret.value}" to ${secretMode.value}`);
    }
    const parts = sss.split(secretBuffer, { shares: shareCount.value, threshold: threshold.value });
    shares.value = parts.map(p => p.toString('hex'));
  }
  catch (err: any) {
    sharesError.value = err.toString();
  }
}

function recombineSecret() {
  recombineError.value = '';
  try {
    const buffers = recombineInput.value.split('\n').map((hex) => {
      const buf = Buffer.from(hex, 'hex');
      if (buf.length === 0) {
        throw new Error(`Cannot convert "${secret.value}" to ${secretMode.value}`);
      }
      return buf;
    });
    const result = sss.combine(buffers);
    recombinedSecret.value = result.toString(secretMode.value);
  }
  catch (err: any) {
    recombineError.value = err.toString();
  }
}
</script>

<template>
  <div>
    <c-select
      v-model:value="secretMode"
      :label="t('tools.shamirs-secret-sharing.texts.label-secret-mode')"
      label-position="left"
      :options="secretModes"
      mb-2
    />
    <c-card :title="t('tools.shamirs-secret-sharing.texts.title-share-a-secret-split')">
      <NForm label-placement="left">
        <NFormItem :label="t('tools.shamirs-secret-sharing.texts.label-secret')">
          <NInput v-model:value="secret" :placeholder="t('tools.shamirs-secret-sharing.texts.placeholder-enter-secret-text')" />
        </NFormItem>

        <n-space justify="center">
          <NFormItem :label="t('tools.shamirs-secret-sharing.texts.label-threshold-minimum-shares-to-recover')">
            <NInputNumber v-model:value="threshold" :min="2" />
          </NFormItem>

          <NFormItem :label="t('tools.shamirs-secret-sharing.texts.label-number-of-shares')">
            <NInputNumber v-model:value="shareCount" :min="2" />
          </NFormItem>
        </n-space>

        <n-space justify="center">
          <NButton type="primary" @click="splitSecret">
            {{ t('tools.shamirs-secret-sharing.texts.tag-split-secret') }}
          </NButton>
        </n-space>
      </NForm>

      <c-alert v-if="sharesError">
        {{ sharesError }}
      </c-alert>
      <c-card v-if="!sharesError && shares.length" :title="t('tools.shamirs-secret-sharing.texts.title-generated-shares')">
        <template v-for="(share, idx) in shares" :key="idx">
          <input-copyable v-model:value="shares[idx]" readonly mb-1 />
        </template>
      </c-card>
    </c-card>

    <c-card :title="t('tools.shamirs-secret-sharing.texts.title-recombine-a-secret')">
      <c-input-text
        v-model:value="recombineInput"
        :label="t('tools.shamirs-secret-sharing.texts.label-your-shares')"
        :placeholder="t('tools.shamirs-secret-sharing.texts.placeholder-paste-your-shares-here')"
        rows="5"
        multiline
        mb-2
      />
      <n-space justify="center">
        <NButton type="success" @click="recombineSecret">
          {{ t('tools.shamirs-secret-sharing.texts.tag-recombine') }}
        </NButton>
      </n-space>
      <c-card v-if="!recombineError" :title="t('tools.shamirs-secret-sharing.texts.title-recombined-secret')">
        <input-copyable :value="recombinedSecret" readonly />
      </c-card>
      <c-alert v-else>
        {{ recombineError }}
      </c-alert>
    </c-card>
  </div>
</template>
