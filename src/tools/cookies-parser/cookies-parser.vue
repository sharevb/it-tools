<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const cookieHeader = useQueryParam({ name: 'cookies', defaultValue: '' });

const parsedCookies = computed(() => {
  return (cookieHeader.value || '').replace(/^Cookie:\s*/, '').split('; ').map((cookie) => {
    const [name, ...values] = cookie.split('=');
    return { name, value: decodeURIComponent(values?.join('=') || '') };
  });
});
</script>

<template>
  <n-card :title="t('tools.cookies-parser.texts.title-cookie-parser')">
    <n-space vertical>
      <n-input v-model:value="cookieHeader" :placeholder="t('tools.cookies-parser.texts.placeholder-enter-cookie-header')" type="text" />
    </n-space>
    <n-p>
      {{ t('tools.cookies-parser.texts.tag-tip-navigate-to-a-website-to-test-open-f12-console-and-run') }}<n-tag :bordered="false">
        <code>{{ t('tools.cookies-parser.texts.tag-window-copy-document-cookie') }}</code>
      </n-tag>{{ t('tools.cookies-parser.texts.tag-this-will-copy-the-cookie-string-to-your-clipboard-note-this-will-only-copy-cookies-available-to-javascript-http-only-and-secure-cookies-will-be-omitted') }}
    </n-p>
    <n-table v-if="parsedCookies.length">
      <thead><tr><th>{{ t('tools.cookies-parser.texts.tag-name') }}</th><th>{{ t('tools.cookies-parser.texts.tag-value') }}</th></tr></thead>
      <tbody>
        <tr v-for="cookie in parsedCookies" :key="cookie.name">
          <td>
            <n-a :href="`https://cookiedatabase.org/?s=${cookie.name}`" target="_blank">
              {{ cookie.name }}
            </n-a>
          </td>
          <td>{{ cookie.value }}</td>
        </tr>
      </tbody>
    </n-table>
    <n-alert v-else type="warning">
      {{ t('tools.cookies-parser.texts.tag-no-cookies-found') }}
    </n-alert>
  </n-card>
</template>
