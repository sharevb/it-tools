<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useITStorage } from '@/composable/queryParams';
import { Base64 } from 'js-base64';
import { useNetworkUtilsConfig } from '../network-utils/network-utils-config';

const { t } = useI18n();

const url = ref('');
const html = ref('');
const error = ref('');
const isRunning = ref(false);

const { serverHost, serverAuth, hasFixedConfig } = useNetworkUtilsConfig({
  urlStorageKey: 'html-to-pdf:url',
  authStorageKey: 'html-to-pdf:auth',
  defaultUrl: 'http://localhost:3000',
});

const options = useITStorage('html-to-pdf:opts', {
  format: 'A4',
  landscape: false,
  printBackground: true,
  onePage: false,
  language: 'en-US',
  autoHideCookies: true,
  margin: {
    top: 20,
    bottom: 20,
    left: 15,
    right: 15,
  },
});

const pdfFormats = [
  { label: t('tools.html-to-pdf.texts.label-a2'), value: 'A2' },
  { label: t('tools.html-to-pdf.texts.label-a3'), value: 'A3' },
  { label: t('tools.html-to-pdf.texts.label-a4'), value: 'A4' },
  { label: t('tools.html-to-pdf.texts.label-a5'), value: 'A5' },
  { label: t('tools.html-to-pdf.texts.label-letter'), value: 'Letter' },
  { label: t('tools.html-to-pdf.texts.label-legal'), value: 'Legal' },
];

function downloadURL(data: string, fileName: string) {
  const a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = 'none';
  a.click();
  a.remove();
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

function urlToFilename(input: string): string {
  let url: URL;

  try {
    url = new URL(input);
  } catch {
    throw new Error(`Invalid URL: ${input}`);
  }

  // Extract pathname or fallback
  let pathname = url.pathname === '/' ? '' : url.pathname;

  // Replace slashes with dashes
  pathname = pathname.replace(/\//g, '-');

  // Remove unsafe filename characters
  let safe = pathname.replace(/[^a-zA-Z0-9\._-]/g, '_');

  // Include hostname for uniqueness
  safe = `${url.hostname}${safe}`;

  // Append query hash if present (hashed for readability)
  if (url.search) {
    const queryHash = Base64.encode(url.search);
    safe += `-${queryHash}`;
  }

  return safe;
}

async function generateFromUrl() {
  const payload = { url: url.value, options: options.value };

  error.value = '';
  isRunning.value = true;
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(serverAuth.value ? { Authorization: `Basic ${Base64.encode(serverAuth.value)}` } : {}),
    };
    const res = await fetch(`${serverHost.value}/pdf/url`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const blob = await res.blob();
    downloadBlob(blob, `${urlToFilename(url.value)}.pdf`);
  } catch (e: any) {
    error.value = e.toString();
  }
  isRunning.value = false;
}

async function generateFromHtml() {
  const payload = { html: html.value, options: options.value };

  error.value = '';
  isRunning.value = true;
  try {
    const res = await fetch(`${serverHost.value}/pdf/html`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      ...(serverAuth.value ? { headers: { Authorization: `Basic ${Base64.encode(serverAuth.value)}` } } : {}),
    });

    const blob = await res.blob();
    downloadBlob(blob, 'printed.pdf');
  } catch (e: any) {
    error.value = e.toString();
  }
  isRunning.value = false;
}

const batchUrls = ref('');

const batchResults = ref<{ url: string; status: 'success' | 'error'; pdfBlob?: Blob; error?: string }[]>([]);
const batchProgress = ref(0);
const batchTotal = ref(0);
const isBatchRunning = ref(false);

async function generateBatch() {
  const urls = batchUrls.value
    .split('\n')
    .map((u) => u.trim())
    .filter(Boolean);

  batchResults.value = [];
  batchTotal.value = urls.length;
  batchProgress.value = 0;
  isBatchRunning.value = true;

  for (const u of urls) {
    const payload = { url: u, options: options.value };

    try {
      const res = await fetch(`${serverHost.value}/pdf/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        ...(serverAuth.value ? { headers: { Authorization: `Basic ${Base64.encode(serverAuth.value)}` } } : {}),
      });

      const blob = await res.blob();

      batchResults.value.push({
        url: u,
        status: 'success',
        pdfBlob: blob,
      });
    } catch (err: any) {
      batchResults.value.push({
        url: u,
        status: 'error',
        error: err.toString(),
      });
    }

    batchProgress.value++;
  }

  isBatchRunning.value = false;
}
</script>

<template>
  <div>
    <details mb-2 v-if="!hasFixedConfig">
      <summary>
        ⚠ {{ t('tools.external-self-hosted-required') }} ⚠ -
        {{ t('tools.html-to-pdf.texts.tag-html-to-pdf-service-configuration-self-hosted') }}
      </summary>
      <n-card>
        <NFormItem :label="t('tools.html-to-pdf.texts.label-html-to-pdf-service-url')" label-placement="top">
          <NInput
            v-model:value="serverHost"
            :placeholder="t('tools.html-to-pdf.texts.placeholder-http-localhost-3000')"
          />
        </NFormItem>
        <NFormItem
          :label="t('tools.html-to-pdf.texts.label-basic-authentication')"
          label-placement="left"
          label-width="auto"
        >
          <NInput
            v-model:value="serverAuth"
            :placeholder="t('tools.html-to-pdf.texts.placeholder-username-password')"
          />
        </NFormItem>
        <n-p>
          {{ t('tools.html-to-pdf.texts.tag-you-must-self-host-html-to-pdf-service-see')
          }}<c-link
            href="https://github.com/sharevb/puppeteer-htmltopdf?tab=readme-ov-file#running-in-docker"
            target="_blank"
          >
            {{ t('tools.html-to-pdf.texts.tag-html-to-pdf-service-install') }}
          </c-link>
        </n-p>
      </n-card>
    </details>

    <NTabs type="line">
      <NTabPane name="url" :tab="t('tools.html-to-pdf.texts.tab-url-pdf')">
        <NForm label-placement="left">
          <NFormItem :label="t('tools.html-to-pdf.texts.label-url')">
            <NInput v-model:value="url" :placeholder="t('tools.html-to-pdf.texts.placeholder-https-example-com')" />
          </NFormItem>

          <n-space mb-2 justify="center">
            <NButton type="primary" :loading="isRunning" :disabled="isRunning" @click="generateFromUrl">
              {{ t('tools.html-to-pdf.texts.tag-generate-pdf') }}
            </NButton>
          </n-space>

          <c-alert v-if="error">
            {{ error }}
          </c-alert>
        </NForm>
      </NTabPane>

      <NTabPane name="html" :tab="t('tools.html-to-pdf.texts.tab-html-pdf')">
        <NForm label-placement="top">
          <NFormItem :label="t('tools.html-to-pdf.texts.label-html-content')">
            <NInput v-model:value="html" type="textarea" :autosize="{ minRows: 10 }" />
          </NFormItem>

          <n-space mb-2 justify="center">
            <NButton type="primary" :loading="isRunning" :disabled="isRunning" @click="generateFromHtml">
              {{ t('tools.html-to-pdf.texts.tag-generate-pdf') }}
            </NButton>
          </n-space>

          <c-alert v-if="error">
            {{ error }}
          </c-alert>
        </NForm>
      </NTabPane>

      <NTabPane name="batch" :tab="t('tools.html-to-pdf.texts.tab-batch-url-pdf')">
        <NForm label-placement="top">
          <NFormItem :label="t('tools.html-to-pdf.texts.label-urls-one-per-line')">
            <NInput v-model:value="batchUrls" type="textarea" :autosize="{ minRows: 8 }" />
          </NFormItem>

          <n-space mb-2 justify="center">
            <NButton type="primary" :loading="isBatchRunning" :disabled="isBatchRunning" @click="generateBatch">
              {{ t('tools.html-to-pdf.texts.tag-generate-pdfs') }}
            </NButton>
          </n-space>
        </NForm>

        <div v-if="isBatchRunning || batchProgress > 0">
          <NProgress
            type="line"
            :percentage="Math.round((batchProgress / batchTotal) * 100)"
            indicator-placement="inside"
            processing
          />
          <n-space justify="center"> {{ batchProgress }} / {{ batchTotal }} processed </n-space>
        </div>

        <!-- Results -->
        <NCard v-if="batchResults.length > 0" :title="t('tools.html-to-pdf.texts.title-results')">
          <n-table>
            <thead>
              <th>{{ t('tools.html-to-pdf.texts.tag-url') }}</th>
              <th>{{ t('tools.html-to-pdf.texts.tag-download') }}</th>
            </thead>
            <tbody>
              <tr v-for="item in batchResults" :key="item.url">
                <td>
                  <strong>{{ item.url }}</strong>
                </td>

                <td>
                  <template v-if="item.status === 'success'">
                    <NButton
                      size="small"
                      type="success"
                      @click="downloadBlob(item.pdfBlob!, `${urlToFilename(item.url)}.pdf`)"
                    >
                      {{ t('tools.html-to-pdf.texts.tag-download-pdf') }}
                    </NButton>
                  </template>

                  <template v-else>
                    <NButton size="small" type="error" disabled>
                      {{ t('tools.html-to-pdf.texts.tag-failed') }}
                    </NButton>
                    <div style="color: red; font-size: 12px">
                      {{ item.error }}
                    </div>
                  </template>
                </td>
              </tr>
            </tbody>
          </n-table>
        </NCard>
      </NTabPane>

      <!-- Custom PDF Options -->
      <NTabPane name="custom-options" :tab="t('tools.html-to-pdf.texts.tab-custom-pdf-options')">
        <NForm label-placement="left">
          <NFormItem :label="t('tools.html-to-pdf.texts.label-format')">
            <NSelect v-model:value="options.format" :options="pdfFormats" />
          </NFormItem>

          <NFormItem :label="t('tools.html-to-pdf.texts.label-language')">
            <NInput v-model:value="options.language" :placeholder="t('tools.html-to-pdf.texts.placeholder-en-us')" />
          </NFormItem>

          <n-space justify="center">
            <NFormItem :label="t('tools.html-to-pdf.texts.label-landscape')">
              <NSwitch v-model:value="options.landscape" />
            </NFormItem>

            <NFormItem :label="t('tools.html-to-pdf.texts.label-one-long-page')">
              <NSwitch v-model:value="options.onePage" />
            </NFormItem>

            <NFormItem :label="t('tools.html-to-pdf.texts.label-auto-hide-cookie-banners')">
              <NSwitch v-model:value="options.autoHideCookies" />
            </NFormItem>

            <NFormItem :label="t('tools.html-to-pdf.texts.label-print-background')">
              <NSwitch v-model:value="options.printBackground" />
            </NFormItem>
          </n-space>

          <c-card :title="t('tools.html-to-pdf.texts.title-margins')">
            <NSpace justify="center">
              <NFormItem :label="t('tools.html-to-pdf.texts.label-top-mm')" style="width: 200px">
                <NInputNumber v-model:value="options.margin.top" />
              </NFormItem>

              <NFormItem :label="t('tools.html-to-pdf.texts.label-bottom-mm')" style="width: 200px">
                <NInputNumber v-model:value="options.margin.bottom" />
              </NFormItem>

              <NFormItem :label="t('tools.html-to-pdf.texts.label-left-mm')" style="width: 200px">
                <NInputNumber v-model:value="options.margin.left" />
              </NFormItem>

              <NFormItem :label="t('tools.html-to-pdf.texts.label-right-mm')" style="width: 200px">
                <NInputNumber v-model:value="options.margin.right" />
              </NFormItem>
            </NSpace>
          </c-card>
        </NForm>
      </NTabPane>
    </NTabs>
  </div>
</template>
