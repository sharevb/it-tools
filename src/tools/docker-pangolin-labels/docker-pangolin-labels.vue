<script setup lang="ts">
import yaml from 'yaml';
import { useI18n } from 'vue-i18n';
import {
  blueprintToLabels,
  extractPangolinLabelsFromCompose,
  pangolinLabelsToBlueprint,
} from './docker-pangolin-labels.service';

const { t } = useI18n();

const composeInput = ref('');
const blueprintOutput = ref('');

const blueprintInput = ref('');
const labelsOutput = ref('');
const labelsAsArray = ref(true);

const error = ref<string | null>(null);

function convertComposeToBlueprint() {
  error.value = null;
  blueprintOutput.value = '';

  try {
    const compose = yaml.parse(composeInput.value) as any;
    if (!compose?.services) {
      throw new Error(t('tools.docker-pangolin-labels.texts.error-invalid-compose'));
    }

    const labels = extractPangolinLabelsFromCompose(compose);
    const blueprint = pangolinLabelsToBlueprint(labels);

    blueprintOutput.value = yaml.stringify(blueprint);
  } catch (err: any) {
    error.value = err.toString();
  }
}

/* -----------------------------
   BLUEPRINT → LABELS
------------------------------ */
function convertBlueprintToLabels() {
  error.value = null;
  labelsOutput.value = '';

  try {
    const blueprint = yaml.parse(blueprintInput.value) as any;
    if (!blueprint || typeof blueprint !== 'object') {
      throw new Error(t('tools.docker-pangolin-labels.texts.error-invalid-blueprint'));
    }

    const labels = blueprintToLabels(blueprint, labelsAsArray.value ? 'array' : 'object');

    labelsOutput.value = yaml.stringify(labels);
  } catch (err: any) {
    error.value = err?.message ?? String(err);
  }
}
</script>

<template>
  <div>
    <n-tabs type="segment">
      <!-- COMPOSE → BLUEPRINT -->
      <n-tab-pane name="compose-to-blueprint" :tab="t('tools.docker-pangolin-labels.texts.tab-compose-to-blueprint')">
        <c-input-text
          v-model:value="composeInput"
          :label="t('tools.docker-pangolin-labels.texts.label-docker-compose-yaml')"
          multiline
          rows="10"
          :placeholder="t('tools.docker-pangolin-labels.texts.placeholder-docker-compose-yaml')"
          mb-2
        />

        <n-space justify="center" mb-2>
          <n-button type="primary" @click="convertComposeToBlueprint">
            {{ t('tools.docker-pangolin-labels.texts.button-extract-blueprint') }}
          </n-button>
        </n-space>

        <n-alert v-if="error" type="error" :show-icon="true">
          {{ error }}
        </n-alert>

        <textarea-copyable
          v-if="blueprintOutput"
          v-model:value="blueprintOutput"
          :label="t('tools.docker-pangolin-labels.texts.label-generated-blueprint')"
          language="yaml"
          readonly
          :placeholder="t('tools.docker-pangolin-labels.texts.placeholder-generated-blueprint')"
        />
      </n-tab-pane>

      <!-- BLUEPRINT → LABELS -->
      <n-tab-pane name="blueprint-to-labels" :tab="t('tools.docker-pangolin-labels.texts.tab-blueprint-to-labels')">
        <c-input-text
          v-model:value="blueprintInput"
          :label="t('tools.docker-pangolin-labels.texts.label-blueprint-yaml')"
          multiline
          rows="5"
          :placeholder="t('tools.docker-pangolin-labels.texts.placeholder-blueprint-yaml')"
          mb-2
        />

        <n-space justify="center" mb-2>
          <n-switch v-model:value="labelsAsArray">
            <template #checked>
              {{ t('tools.docker-pangolin-labels.texts.switch-array-format') }}
            </template>
            <template #unchecked>
              {{ t('tools.docker-pangolin-labels.texts.switch-object-format') }}
            </template>
          </n-switch>
        </n-space>

        <n-space justify="center" mb-2>
          <n-button type="primary" @click="convertBlueprintToLabels">
            {{ t('tools.docker-pangolin-labels.texts.button-convert-to-labels') }}
          </n-button>
        </n-space>

        <textarea-copyable
          v-if="labelsOutput"
          v-model:value="labelsOutput"
          :label="t('tools.docker-pangolin-labels.texts.label-generated-docker-labels')"
          rows="16"
          language="yaml"
          :placeholder="t('tools.docker-pangolin-labels.texts.placeholder-generated-docker-labels')"
        />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
