<script setup lang="ts">
import { useITStorage, useQueryParam } from '@/composable/queryParams';

const command = useQueryParam({ tool: 'explainshell', name: 'command', defaultValue: '' });
const explainshellUrl = useITStorage('explainchain:url', 'https://explainshell.com');

const iframeUrl = ref('');
function openExplain() {
  const encoded = encodeURIComponent(command.value.trim());
  iframeUrl.value = `${explainshellUrl.value}/explain?cmd=${encoded}`;
}
</script>

<template>
  <div>
    <details mb-1>
      <summary>Explain Shell Configuration</summary>
      <n-card>
        <c-input-text
          v-model:value="explainshellUrl"
          label="Custom Explain Shell Url:"
          label-position="left"
          placeholder="Put your custom explainshell url here..."
          mb-1
        />
        <n-p>
          You can self host Explain Shell, to get total privacy. See:
          <c-link href="https://github.com/idank/explainshell?tab=readme-ov-file#running-explainshell-locally" target="_blank">
            Local Explain Shell docker install
          </c-link>
        </n-p>
      </n-card>
    </details>
    <n-form-item label="Shell command:" label-placement="left">
      <n-input
        v-model:value="command"
        placeholder="Shell command to explain"
        clearable
        mr-1
      />
    </n-form-item>

    <n-space justify="center">
      <n-button
        type="primary"
        :disabled="!command"
        @click="openExplain"
      >
        Explain
      </n-button>
    </n-space>

    <n-divider />

    <div style="height: 70vh; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
      <iframe
        v-if="iframeUrl"
        :src="iframeUrl"
        style="width: 100%; height: 100%; border: none;"
      />
      <div v-else style="padding: 1rem; text-align: center; color: #888;">
        Enter a shell command to explain
      </div>
    </div>
  </div>
</template>
