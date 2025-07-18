<script setup lang="ts">
import { SwaggerUIBundle } from 'swagger-ui-dist';
import 'swagger-ui-dist/swagger-ui.css';
import yaml from 'yaml';
import json5 from 'json5';

const errorMessage = ref('');
const manifestText = ref('');
const swaggerContainer = ref(null);

function renderSwagger() {
  try {
    errorMessage.value = '';
    let parsed: any;
    try {
      parsed = json5.parse(manifestText.value);
    }
    catch {
      parsed = yaml.parse(manifestText.value);
    }

    SwaggerUIBundle({
      spec: parsed,
      domNode: swaggerContainer.value,
    });
  }
  catch (e: any) {
    errorMessage.value = e.toString();
  }
}
</script>

<template>
  <n-space vertical>
    <details>
      <summary>Swagger Manifest:</summary>
      <c-input-text
        v-model:value="manifestText"
        placeholder="Paste your Swagger/OpenAPI JSON manifest here"
        multiline
        rows="10"
      />
    </details>
    <n-space justify="center">
      <n-button type="primary" @click="renderSwagger">
        Render Swagger UI
      </n-button>
    </n-space>

    <c-alert v-if="errorMessage" type="error">
      {{ errorMessage }}
    </c-alert>

    <c-card title="Swagger UI" style="background-color: #fff;">
      <div ref="swaggerContainer" class="swagger-ui" />
    </c-card>
  </n-space>
</template>
