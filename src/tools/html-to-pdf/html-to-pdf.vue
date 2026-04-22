<script setup lang="ts">
import { useITStorage } from '@/composable/queryParams';
import { Base64 } from 'js-base64';

const url = ref('');
const html = ref('');
const error = ref('');
const isRunning = ref(false);

const serverHost = useITStorage('html-to-pdf:url', 'http://localhost:3000');
const serverAuth = useITStorage('html-to-pdf:auth', '');

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
  { label: 'A2', value: 'A2' },
  { label: 'A3', value: 'A3' },
  { label: 'A4', value: 'A4' },
  { label: 'A5', value: 'A5' },
  { label: 'Letter', value: 'Letter' },
  { label: 'Legal', value: 'Legal' },
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
  }
  catch {
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
    const res = await fetch(`${serverHost.value}/pdf/url`, {
      ...{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      ...(serverAuth.value ? { headers: { Authorization: `Basic ${Base64.encode(serverAuth.value)}` } } : {}),
    });

    const blob = await res.blob();
    downloadBlob(blob, `${urlToFilename(url.value)}.pdf`);
  }
  catch (e: any) {
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
      ...{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      ...(serverAuth.value ? { headers: { Authorization: `Basic ${Base64.encode(serverAuth.value)}` } } : {}),
    });

    const blob = await res.blob();
    downloadBlob(blob, 'printed.pdf');
  }
  catch (e: any) {
    error.value = e.toString();
  }
  isRunning.value = false;
}

const batchUrls = ref('');

const batchResults = ref<{ url: string; status: 'success' | 'error' ; pdfBlob?: Blob; error?: string }[]>([]);
const batchProgress = ref(0);
const batchTotal = ref(0);
const isBatchRunning = ref(false);

async function generateBatch() {
  const urls = batchUrls.value
    .split('\n')
    .map(u => u.trim())
    .filter(Boolean);

  batchResults.value = [];
  batchTotal.value = urls.length;
  batchProgress.value = 0;
  isBatchRunning.value = true;

  for (const u of urls) {
    const payload = { url: u, options: options.value };

    try {
      const res = await fetch(`${serverHost.value}/pdf/url`, {
        ...{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
        ...(serverAuth.value ? { headers: { Authorization: `Basic ${Base64.encode(serverAuth.value)}` } } : {}),
      });

      const blob = await res.blob();

      batchResults.value.push({
        url: u,
        status: 'success',
        pdfBlob: blob,
      });
    }
    catch (err: any) {
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
    <details mb-2>
      <summary>HTML to PDF Service Configuration (self hosted)</summary>
      <n-card>
        <NFormItem label="HTML to PDF Service Url:" label-placement="top">
          <NInput v-model:value="serverHost" placeholder="http://localhost:3000" />
        </NFormItem>
        <NFormItem label="Basic Authentication:" label-placement="left" label-width="auto">
          <NInput v-model:value="serverAuth" placeholder="username:password" />
        </NFormItem>
        <n-p>
          You must self host HTML to PDF Service. See:
          <c-link href="https://github.com/sharevb/puppeteer-htmltopdf?tab=readme-ov-file#running-in-docker" target="_blank">
            HTML to PDF Service install
          </c-link>
        </n-p>
      </n-card>
    </details>

    <NTabs type="line">
      <NTabPane name="url" tab="URL → PDF">
        <NForm label-placement="left">
          <NFormItem label="URL:">
            <NInput v-model:value="url" placeholder="https://example.com" />
          </NFormItem>

          <n-space mb-2 justify="center">
            <NButton
              type="primary"
              :loading="isRunning"
              :disabled="isRunning"
              @click="generateFromUrl"
            >
              Generate PDF
            </NButton>
          </n-space>

          <c-alert v-if="error">
            {{ error }}
          </c-alert>
        </NForm>
      </NTabPane>

      <NTabPane name="html" tab="HTML → PDF">
        <NForm label-placement="top">
          <NFormItem label="HTML Content:">
            <NInput
              v-model:value="html"
              type="textarea"
              :autosize="{ minRows: 10 }"
            />
          </NFormItem>

          <n-space mb-2 justify="center">
            <NButton
              type="primary"
              :loading="isRunning"
              :disabled="isRunning"
              @click="generateFromHtml"
            >
              Generate PDF
            </NButton>
          </n-space>

          <c-alert v-if="error">
            {{ error }}
          </c-alert>
        </NForm>
      </NTabPane>

      <NTabPane name="batch" tab="Batch URL → PDF">
        <NForm label-placement="top">
          <NFormItem label="URLs (one per line):">
            <NInput
              v-model:value="batchUrls"
              type="textarea"
              :autosize="{ minRows: 8 }"
            />
          </NFormItem>

          <n-space mb-2 justify="center">
            <NButton
              type="primary"
              :loading="isBatchRunning"
              :disabled="isBatchRunning"
              @click="generateBatch"
            >
              Generate PDFs
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
          <n-space justify="center">
            {{ batchProgress }} / {{ batchTotal }} processed
          </n-space>
        </div>

        <!-- Results -->
        <NCard v-if="batchResults.length > 0" title="Results">
          <n-table>
            <thead>
              <th>Url</th>
              <th>Download</th>
            </thead>
            <tbody>
              <tr
                v-for="item in batchResults"
                :key="item.url"
              >
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
                      Download PDF
                    </NButton>
                  </template>

                  <template v-else>
                    <NButton size="small" type="error" disabled>
                      Failed
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
      <NTabPane name="custom-options" tab="Custom PDF Options">
        <NForm label-placement="left">
          <NFormItem label="Format:">
            <NSelect
              v-model:value="options.format"
              :options="pdfFormats"
            />
          </NFormItem>

          <NFormItem label="Language:">
            <NInput v-model:value="options.language" placeholder="en-US" />
          </NFormItem>

          <n-space justify="center">
            <NFormItem label="Landscape:">
              <NSwitch v-model:value="options.landscape" />
            </NFormItem>

            <NFormItem label="One Long Page:">
              <NSwitch v-model:value="options.onePage" />
            </NFormItem>

            <NFormItem label="Auto-Hide Cookie Banners:">
              <NSwitch v-model:value="options.autoHideCookies" />
            </NFormItem>

            <NFormItem label="Print Background:">
              <NSwitch v-model:value="options.printBackground" />
            </NFormItem>
          </n-space>

          <c-card title="Margins">
            <NSpace justify="center">
              <NFormItem label="Top (mm):" style="width: 200px">
                <NInputNumber v-model:value="options.margin.top" />
              </NFormItem>

              <NFormItem label="Bottom (mm):" style="width: 200px">
                <NInputNumber v-model:value="options.margin.bottom" />
              </NFormItem>

              <NFormItem label="Left (mm):" style="width: 200px">
                <NInputNumber v-model:value="options.margin.left" />
              </NFormItem>

              <NFormItem label="Right (mm):" style="width: 200px">
                <NInputNumber v-model:value="options.margin.right" />
              </NFormItem>
            </NSpace>
          </c-card>
        </NForm>
      </NTabPane>
    </NTabs>
  </div>
</template>
