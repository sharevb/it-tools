<script setup lang="ts">
import { extractEnvFromCompose } from './docker-compose-to-env-file.service';

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
      label="Docker Compose file:"
      multiline
      placeholder="Paste your docker-compose YAML here..."
      rows="10"
      mb-2
    />

    <n-card title="Extract .env">
      <textarea-copyable
        v-model:value="envOutput"
        rows="3"
        multiline
      />
    </n-card>
  </div>
</template>
