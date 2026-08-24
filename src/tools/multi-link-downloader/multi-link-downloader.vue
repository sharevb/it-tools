<script setup lang="ts">
/* NO EXTRACT SCRIPT */
import { downloadLinks } from './multi-link-downloader.service';
import { useNetworkUtilsConfig } from '../network-utils/network-utils-config';
import { useITStorage } from '@/composable/queryParams';

const { t } = useI18n();

const {
  serverHost: corsAnywhereUrl,
  serverAuth,
  hasFixedConfig,
} = useNetworkUtilsConfig({
  urlStorageKey: 'multi-links-dl:url',
  authStorageKey: 'multi-links-dl:auth',
});

const links = ref<string>('');
const downloadMultiLinks = () => {
  if (links.value) {
    downloadLinks(
      links.value,
      corsAnywhereUrl.value
        ? {
            serverHost: corsAnywhereUrl.value,
            serverAuth: serverAuth.value,
          }
        : undefined,
    );
  }
};

const clearInput = () => {
  links.value = '';
};
</script>

<template>
  <c-card>
    <details v-if="!hasFixedConfig">
      <summary>
        ⚠ {{ t('tools.external-self-hosted-required') }} ⚠ -
        {{ t('tools.short-urls-expander.texts.cors-anywhere-configuration') }}
      </summary>
      <n-card>
        <c-input-text
          v-model:value="corsAnywhereUrl"
          :label="t('tools.short-urls-expander.texts.cors-anywhere-instance-url')"
          label-position="left"
          :placeholder="t('tools.short-urls-expander.texts.put-your-cors-anywhere-instance-url')"
          mb-1
        />
        <NFormItem
          :label="t('tools.https-tester.texts.label-basic-authentication')"
          label-placement="left"
          label-width="auto"
        >
          <NInput
            v-model:value="serverAuth"
            :placeholder="t('tools.https-tester.texts.placeholder-username-password')"
          />
        </NFormItem>
        <n-p>
          {{
            t(
              'tools.short-urls-expander.texts.this-tools-requires-a-cors-anywhere-instance-to-bypass-cors-policy-you-can-use-a',
            )
          }}
          <a href="https://github.com/sharevb/cors-anywhere?tab=readme-ov-file#run-with-docker" target="_blank">
            {{ t('tools.short-urls-expander.texts.self-hosted-cors-anywhere') }}
          </a>
        </n-p>
      </n-card>
    </details>
    <div class="mb-4 flex justify-between">
      <c-button class="mr-2" :disabled="!links" @click="downloadMultiLinks">
        {{ t('tools.multi-link-downloader.texts.tag-start-download') }}
      </c-button>
      <c-button class="ml-2" @click="clearInput"> {{ t('tools.multi-link-downloader.texts.tag-clear') }} </c-button>
    </div>

    <c-input-text
      v-model:value="links"
      :placeholder="t('tools.multi-link-downloader.texts.placeholder-add-links-separated-by-new-lines')"
      multiline
      :rows="20"
    />
  </c-card>
</template>
