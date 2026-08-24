<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useITStorage, useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

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
      <summary>{{ t('tools.explainshell.texts.tag-explain-shell-configuration') }}</summary>
      <n-card>
        <c-input-text
          v-model:value="explainshellUrl"
          :label="t('tools.explainshell.texts.label-custom-explain-shell-url')"
          label-position="left"
          :placeholder="t('tools.explainshell.texts.placeholder-put-your-custom-explainshell-url-here')"
          mb-1
        />
        <n-p>
          {{ t('tools.explainshell.texts.tag-you-can-self-host-explain-shell-to-get-total-privacy-see')
          }}<c-link
            href="https://github.com/idank/explainshell?tab=readme-ov-file#running-explainshell-locally"
            target="_blank"
          >
            {{ t('tools.explainshell.texts.tag-local-explain-shell-docker-install') }}
          </c-link>
        </n-p>
      </n-card>
    </details>
    <n-form-item :label="t('tools.explainshell.texts.label-shell-command')" label-placement="left">
      <n-input
        v-model:value="command"
        :placeholder="t('tools.explainshell.texts.placeholder-shell-command-to-explain')"
        clearable
        mr-1
      />
    </n-form-item>

    <n-space justify="center">
      <n-button type="primary" :disabled="!command" @click="openExplain">
        {{ t('tools.explainshell.texts.tag-explain') }}
      </n-button>
    </n-space>

    <n-divider />

    <div style="height: 70vh; border: 1px solid #ddd; border-radius: 6px; overflow: hidden">
      <iframe v-if="iframeUrl" :src="iframeUrl" style="width: 100%; height: 100%; border: none" credentialless />
      <div v-else style="padding: 1rem; text-align: center; color: #888">
        {{ t('tools.explainshell.texts.tag-enter-a-shell-command-to-explain') }}
      </div>
    </div>
  </div>
</template>
