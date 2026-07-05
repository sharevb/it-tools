<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useITStorage, useQueryParamOrStorage } from '@/composable/queryParams';
import { Base64 } from 'js-base64';

const { t } = useI18n();

const message = useMessage();
const notification = useNotification();

const username = ref('');
const password = ref('');

const image = useQueryParamOrStorage({ name: 'image', storageName: 'docker-dl:i', defaultValue: '' });
const platform = useQueryParamOrStorage({ name: 'platform', storageName: 'docker-dl:p', defaultValue: '' });
const registry = useQueryParamOrStorage({ name: 'registry', storageName: 'docker-dl:r', defaultValue: '' });
const serverHost = useITStorage('docker-dl:url', 'http://localhost:3000');
const serverAuth = useITStorage('docker-dl:auth', '');

const loading = ref(false);
const error = ref<string | null>(null);

// Platform options
const platformOptions = [
  { label: t('tools.docker-image-downloader.texts.label-linux-amd64'), value: 'linux/amd64' },
  { label: t('tools.docker-image-downloader.texts.label-linux-arm64'), value: 'linux/arm64' },
  { label: t('tools.docker-image-downloader.texts.label-linux-arm-v7'), value: 'linux/arm/v7' },
  { label: t('tools.docker-image-downloader.texts.label-linux-arm-v6'), value: 'linux/arm/v6' },
  { label: t('tools.docker-image-downloader.texts.label-linux-ppc64le'), value: 'linux/ppc64le' },
  { label: t('tools.docker-image-downloader.texts.label-linux-s390x'), value: 'linux/s390x' },
  { label: t('tools.docker-image-downloader.texts.label-windows-amd64'), value: 'windows/amd64' },
];

async function downloadImage() {
  error.value = null;

  if (!image.value) {
    error.value = 'Image name is required.';
    return;
  }

  loading.value = true;

  try {
    const params = new URLSearchParams();
    params.append('image', image.value);

    if (platform.value) {
      params.append('platform', platform.value);
    }
    if (registry.value) {
      params.append('registry', registry.value);
    }
    if (username.value) {
      params.append('username', username.value);
    }
    if (password.value) {
      params.append('password', password.value);
    }

    const url = `${serverHost.value}/download?${params.toString()}`;

    const response = await fetch(url,
      serverAuth.value
        ? {
            method: 'GET',
            headers: { Authorization: `Basic ${Base64.encode(serverAuth.value)}` },
          }
        : undefined);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Server error');
    }

    // Extract filename from Content-Disposition
    const disposition = response.headers.get('Content-Disposition');
    const filename
      = disposition?.match(/filename="(.+)"/)?.[1]
      || `${image.value.replace(/[/:]/g, '_')}.tar`;

    // Download file
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    notification.success({
      title: 'Download started',
      description: `Downloading ${filename}`,
    });
  }
  catch (err: any) {
    error.value = err.message || 'Unknown error';
    message.error(error.value!);
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <NForm label-width="120px" label-placement="left">
      <details mb-2>
        <summary>{{ t('tools.docker-image-downloader.texts.tag-docker-image-download-service-configuration-self-hosted') }}</summary>
        <n-card>
          <NFormItem :label="t('tools.docker-image-downloader.texts.label-docker-image-download-service-url')" label-placement="top">
            <NInput v-model:value="serverHost" :placeholder="t('tools.docker-image-downloader.texts.placeholder-http-localhost-3000')" />
          </NFormItem>
          <NFormItem :label="t('tools.docker-image-downloader.texts.label-basic-authentication')" label-placement="left" label-width="auto">
            <NInput v-model:value="serverAuth" :placeholder="t('tools.docker-image-downloader.texts.placeholder-username-password')" />
          </NFormItem>
          <n-p>
            {{ t('tools.docker-image-downloader.texts.tag-you-must-self-host-docker-image-download-service-see') }}<c-link href="https://github.com/sharevb/docker-image-download-server?tab=readme-ov-file#running-in-docker" target="_blank">
              {{ t('tools.docker-image-downloader.texts.tag-docker-image-download-service-install') }}
            </c-link>
          </n-p>
        </n-card>
      </details>

      <NFormItem :label="t('tools.docker-image-downloader.texts.label-docker-image')">
        <NInput v-model:value="image" :placeholder="t('tools.docker-image-downloader.texts.placeholder-alpine-latest')" />
      </NFormItem>

      <NFormItem :label="t('tools.docker-image-downloader.texts.label-platform')">
        <NSelect
          v-model:value="platform"
          :options="platformOptions"
          clearable
        />
      </NFormItem>

      <NFormItem :label="t('tools.docker-image-downloader.texts.label-registry-url')">
        <NInput v-model:value="registry" :placeholder="t('tools.docker-image-downloader.texts.placeholder-myregistry-com-optional')" />
      </NFormItem>

      <NFormItem :label="t('tools.docker-image-downloader.texts.label-username')">
        <NInput v-model:value="username" :placeholder="t('tools.docker-image-downloader.texts.placeholder-optional')" />
      </NFormItem>

      <NFormItem :label="t('tools.docker-image-downloader.texts.label-password')">
        <NInput
          v-model:value="password"
          type="password"
          show-password-on="click"
        />
      </NFormItem>
    </NForm>

    <n-space justify="center">
      <NButton
        type="primary"
        :loading="loading"
        @click="downloadImage"
      >
        {{ t('tools.docker-image-downloader.texts.tag-download-image') }}
      </NButton>
    </n-space>

    <div v-if="error" mt-2>
      <NAlert type="error" :title="t('tools.docker-image-downloader.texts.title-error')" :bordered="false">
        {{ error }}
      </NAlert>
    </div>
  </div>
</template>
