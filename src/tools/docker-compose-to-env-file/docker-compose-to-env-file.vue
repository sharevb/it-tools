<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { extractEnvFromCompose } from './docker-compose-to-env-file.service';

const { t } = useI18n();

const yamlInput = ref(`services:
  web:
    environment:
      PORT: 3000
      DEBUG: true
  db:
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
`);
const envOutput = computed(() => {
  try {
    return extractEnvFromCompose(yamlInput.value);
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="yamlInput"
      :label="t('tools.docker-compose-to-env-file.texts.label-docker-compose-file')"
      multiline
      :placeholder="t('tools.docker-compose-to-env-file.texts.placeholder-paste-your-docker-compose-yaml-here')"
      rows="10"
      mb-2
    />

    <n-card :title="t('tools.docker-compose-to-env-file.texts.title-extract-env')">
      <textarea-copyable
        v-model:value="envOutput"
        rows="3"
        download-file-name=".env"
        multiline
      />
    </n-card>
  </div>
</template>
