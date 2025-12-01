<script setup lang="ts">
const inputUrls = ref('');
const results = ref<{ short: string; expanded: string | null; ok: boolean; status: string }[]>([]);
const error = ref('');
const loading = ref(false);

function expandSingleUrl(url: string): Promise<{ short: string; expanded: string | null; ok: boolean; status: string }> {
  return new Promise((resolve) => {
    try {
      const corsUrl = `https://cors-anywhere.com/${url}`;
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', corsUrl, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.DONE) {
          // In browsers, xhr.responseURL gives the final resolved URL after redirects
          const finalUrl = xhr.getResponseHeader('X-Final-Url') || xhr.responseURL;
          if (finalUrl && finalUrl !== corsUrl) {
            resolve({ short: url, expanded: finalUrl, status: 'Expanded', ok: true });
          }
          else {
            resolve({ short: url, expanded: null, status: 'No redirect', ok: true });
          }
        }
      };
      xhr.onerror = function () {
        resolve({ short: url, expanded: null, status: 'Failed', ok: false });
      };
      xhr.send();
    }
    catch {
      resolve({ short: url, expanded: null, status: 'Failed', ok: false });
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
    error.value = 'Failed to expand some URLs.';
  }
  finally {
    loading.value = false;
  }
}

function downloadCsv() {
  if (!results.value.length) {
    return;
  }

  const header = ['Short URL', 'Expanded URL', 'Status'];
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
      <n-p mb-1>
        <strong>This tool make use of https://cors-anywhere.com to bypass CORS. This is a community driven server.</strong>
        <n-a href="https://cors-anywhere.com" target="_blank">
          See here for more information
        </n-a>
      </n-p>
      <c-input-text
        v-model:value="inputUrls"
        label="Short URLs to expand:"
        multiline
        rows="5"
        placeholder="Enter short URLs (one per line)"
        clearable
        mb-1
      />
      <n-space justify="center" mb-2>
        <NButton type="primary" :loading="loading" @click="expandUrls">
          Expand All
        </NButton>
      </n-space>

      <c-card v-if="results.length" title="Result">
        <n-space justify="center" mb-2>
          <NButton type="primary" @click="downloadCsv">
            Download resuls as CSV
          </NButton>
        </n-space>
        <n-table>
          <thead>
            <tr>
              <th width="30%">
                Short Url
              </th>
              <th width="45%">
                Expanded Url
              </th>
              <th>
                Link
              </th>
              <th>
                Status
              </th>
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
                  Open Url
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
