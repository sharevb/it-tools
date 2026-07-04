<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Jasypt from 'jasypt';

const { t } = useI18n();

const mode = ref<'encrypt' | 'decrypt'>('encrypt');
const password = ref('');
const inputText = ref('');
const outputRaw = ref('');
const error = ref('');

const outputEncSyntax = computed(() =>
  outputRaw.value ? `ENC(${outputRaw.value})` : '',
);

const isEncryptMode = computed(() => mode.value === 'encrypt');

function run() {
  error.value = '';
  try {
    const jasypt = new Jasypt();
    jasypt.setPassword(password.value);

    if (isEncryptMode.value) {
      outputRaw.value = jasypt.encrypt(inputText.value);
    }
    else {
      outputRaw.value = jasypt.decrypt(inputText.value.trim().replace(/^ENC\(|\)$/g, ''));
    }
  }
  catch (err: any) {
    outputRaw.value = '';
    error.value = err.toString();
  }
}
</script>

<template>
  <div>
    <NForm label-placement="left" label-width="160px">
      <NFormItem :label="t('tools.jasypt-string-encryption.texts.label-mode')">
        <NRadioGroup v-model:value="mode" size="small">
          <NRadioButton value="encrypt">
            {{ t('tools.jasypt-string-encryption.texts.tag-encrypt') }}
          </NRadioButton>
          <NRadioButton value="decrypt">
            {{ t('tools.jasypt-string-encryption.texts.tag-decrypt') }}
          </NRadioButton>
        </NRadioGroup>
      </NFormItem>

      <NFormItem :label="t('tools.jasypt-string-encryption.texts.label-password-secret-key')">
        <NInput
          v-model:value="password"
          type="password"
          show-password-on="click"
          :placeholder="t('tools.jasypt-string-encryption.texts.placeholder-enter-jasypt-password-salt-secret-key')"
        />
      </NFormItem>

      <NFormItem :label="isEncryptMode ? t('tools.jasypt-string-encryption.texts.plain-text') : t('tools.jasypt-string-encryption.texts.jasypt-encrypted-string')">
        <NInput
          v-model:value="inputText"
          type="textarea"
          rows="6"
          :placeholder="isEncryptMode
            ? t('tools.jasypt-string-encryption.texts.text-to-encrypt-e-g-db-password')
            : t('tools.jasypt-string-encryption.texts.encrypted-value-e-g-enc-or-raw-jasypt-string')"
        />
      </NFormItem>

      <NSpace justify="center" mb-2>
        <NButton type="primary" :disabled="!password || !inputText" @click="run">
          {{ isEncryptMode ? 'Encrypt' : 'Decrypt' }}
        </NButton>
      </NSpace>

      <c-alert v-if="error" mb-1>
        {{ error }}
      </c-alert>

      <NCard v-if="outputRaw" :title="t('tools.jasypt-string-encryption.texts.title-results')">
        <input-copyable :label="t('tools.jasypt-string-encryption.texts.label-decoded')" label-position="left" :value="outputRaw" mb-1 />
        <input-copyable v-if="isEncryptMode" :label="t('tools.jasypt-string-encryption.texts.label-raw')" label-position="left" :value="outputRaw" mb-1 />
        <input-copyable v-if="isEncryptMode" :label="t('tools.jasypt-string-encryption.texts.label-enc-form')" label-position="left" :value="outputEncSyntax" />
      </NCard>
    </NForm>
  </div>
</template>
