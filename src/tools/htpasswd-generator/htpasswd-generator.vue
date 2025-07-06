<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { generateHtpasswd } from './htpasswd-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const username = ref('');
const password = ref('');
const hashMethod = ref('bcrypt');
const saltCount = ref(10);

const algos = [
  { value: 'bcrypt', label: t('tools.htpasswd-generator.texts.label-bcrypt') },
  { value: 'md5', label: t('tools.htpasswd-generator.texts.label-md5') },
  { value: 'apr1', label: t('tools.htpasswd-generator.texts.label-apache-md5-apr1') },
  { value: 'sha256', label: t('tools.htpasswd-generator.texts.label-sha256') },
  { value: 'sha512', label: t('tools.htpasswd-generator.texts.label-sha512') },
];

const htpasswd = computed(() => {
  if (username.value === '' || password.value === '') {
    return '# username and password must not be empty';
  }

  return generateHtpasswd({
    username: username.value,
    password: password.value,
    saltRounds: saltCount.value,
    algorithm: hashMethod.value as never,
  });
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="username"
      :label="t('tools.htpasswd-generator.texts.label-username')"
      :placeholder="t('tools.htpasswd-generator.texts.placeholder-your-username')"
      clearable raw-text mb-5
    />
    <c-input-text
      v-model:value="password"
      :label="t('tools.htpasswd-generator.texts.label-password')"
      :placeholder="t('tools.htpasswd-generator.texts.placeholder-your-password')"
      clearable
      raw-text
      mb-2
      type="password"
    />

    <c-select
      v-model:value="hashMethod"
      :label="t('tools.htpasswd-generator.texts.label-hash-method')"
      :options="algos"
      mb-2
    />

    <n-form-item v-if="hashMethod === 'bcrypt'" :label="t('tools.htpasswd-generator.texts.label-salt-rounds')" label-placement="left" label-width="120">
      <n-input-number v-model:value="saltCount" :placeholder="t('tools.htpasswd-generator.texts.placeholder-salt-rounds')" :max="100" :min="0" w-full />
    </n-form-item>

    <n-divider />

    <n-form-item :label="t('tools.htpasswd-generator.texts.label-htpasswd-content')">
      <TextareaCopyable :value="htpasswd" />
    </n-form-item>
  </div>
</template>
