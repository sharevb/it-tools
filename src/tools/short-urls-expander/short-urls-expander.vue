<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useITStorage } from '@/composable/queryParams';

const { t } = useI18n();
const inputUrls = ref('');
const results = ref<{ short: string; expanded: string | null; ok: boolean; status: string }[]>([]);
const error = ref('');
const loading = ref(false);
const corsAnywhereUrl = useITStorage('short-urls-expander:cors-anywhere-url', '//cors.outils-libre.org');

function expandSingleUrl(url: string): Promise<{ short: string; expanded: string | null; ok: boolean; status: string }> {
  return new Promise((resolve) => {
    try {
      const corsUrl = `${corsAnywhereUrl.value.replace(/\/+$/g, '')}/${url}`;
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', corsUrl, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.DONE) {
          // In browsers, xhr.responseURL gives the final resolved URL after redirects
          const finalUrl = xhr.getResponseHeader('X-Final-Url') || xhr.responseURL;
          if (finalUrl && finalUrl !== corsUrl) {
            resolve({ short: url, expanded: finalUrl, status: t('tools.short-urls-expander.texts.expanded'), ok: true });
          }
          else {
            resolve({ short: url, expanded: null, status: t('tools.short-urls-expander.texts.no-redirect'), ok: true });
          }
        }
      };
      xhr.onerror = function () {
        resolve({ short: url, expanded: null, status: t('tools.short-urls-expander.texts.failed'), ok: false });
      };
      xhr.send();
    }
    catch {
      resolve({ short: url, expanded: null, status: t('tools.short-urls-expander.texts.failed'), ok: false });
    }
  });
}

async function expandUrls() {
  results.value = [];
  error.value = '';
  loading.value = true;

  const urls = inputUrls.value
    .split('\n')
    .map(u => u.trim())
    .filter(u => u.length > 0);

  try {
    const promises = urls.map(async (url) => {
      return await expandSingleUrl(url);
    });

    results.value = await Promise.all(promises);
  }
  catch (err) {
    error.value = t('tools.short-urls-expander.texts.failed-to-expand-some-urls');
  }
  finally {
    loading.value = false;
  }
}

function downloadCsv() {
  if (!results.value.length) {
    return;
  }

  const header = [t('tools.short-urls-expander.texts.short-url'), t('tools.short-urls-expander.texts.expanded-url'), t('tools.short-urls-expander.texts.tag-status')];
  const rows = results.value.map(r => [
    r.short,
    r.expanded ?? '',
    r.status,
  ]);

  const csvContent = [header, ...rows]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'expanded_urls.csv';
  link.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div>
    <NSpace vertical>
      <details>
        <summary>{{ t('tools.short-urls-expander.texts.cors-anywhere-configuration') }}</summary>
        <n-card>
          <c-input-text
            v-model:value="corsAnywhereUrl"
            :label="t('tools.short-urls-expander.texts.cors-anywhere-instance-url')"
            label-position="left"
            :placeholder="t('tools.short-urls-expander.texts.put-your-cors-anywhere-instance-url')"
            mb-1
          />
          <n-p>
            {{ t('tools.short-urls-expander.texts.this-tools-requires-a-cors-anywhere-instance-to-bypass-cors-policy-you-can-use-a') }}
            <a href="https://github.com/sharevb/cors-anywhere?tab=readme-ov-file#run-with-docker" target="_blank">
              {{ t('tools.short-urls-expander.texts.self-hosted-cors-anywhere') }}
            </a>
          </n-p>
        </n-card>
      </details>
      <c-input-text
        v-model:value="inputUrls"
        :label="t('tools.short-urls-expander.texts.label-short-urls-to-expand')"
        multiline
        rows="5"
        :placeholder="t('tools.short-urls-expander.texts.placeholder-enter-short-urls-one-per-line')"
        clearable
        mb-1
      />
      <n-space justify="center" mb-2>
        <NButton type="primary" :loading="loading" @click="expandUrls">
          {{ t('tools.short-urls-expander.texts.tag-expand-all') }}
        </NButton>
      </n-space>

      <c-card v-if="results.length" :title="t('tools.short-urls-expander.texts.title-result')">
        <n-space justify="center" mb-2>
          <NButton type="primary" @click="downloadCsv">
            {{ t('tools.short-urls-expander.texts.tag-download-resuls-as-csv') }}
          </NButton>
        </n-space>
        <n-table>
          <thead>
            <tr>
              <th width="30%">
                {{ t('tools.short-urls-expander.texts.tag-short-url') }}
              </th>
              <th width="45%">
                {{ t('tools.short-urls-expander.texts.tag-expanded-url') }}
              </th>
              <th>{{ t('tools.short-urls-expander.texts.tag-link') }}</th>
              <th>{{ t('tools.short-urls-expander.texts.tag-status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(url, index) of results" :key="index">
              <td>{{ url.short }}</td>
              <td>
                <input-copyable :value="url.expanded" />
              </td>
              <td>
                <n-a v-if="url.expanded" :href="url.expanded" target="_blank">
                  {{ t('tools.short-urls-expander.texts.tag-open-url') }}
                </n-a>
              </td>
              <td :style="{ color: url.ok ? 'green' : 'red' }">
                {{ url.status }}
              </td>
            </tr>
          </tbody>
        </n-table>
      </c-card>

      <NAlert v-if="error" type="error">
        {{ error }}
      </NAlert>
    </NSpace>
  </div>
</template>
