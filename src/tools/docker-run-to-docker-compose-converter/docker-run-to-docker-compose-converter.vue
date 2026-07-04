<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import composerize from 'composerize';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { textToBase64 } from '@/utils/base64';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const dockerRuns = ref(
  'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx',
);
const indentSize = useQueryParamOrStorage({ name: 'indent', storageName: 'docker-run-to-compose:indent-size', defaultValue: 4 });

const existingDockerComposeFile = ref(
  '',
);
const format = useQueryParamOrStorage({ name: 'fmt', storageName: 'docker-run-to-compose:format', defaultValue: 'latest' });
const formatOptions = [
  { value: 'v2x', label: t('tools.docker-run-to-docker-compose-converter.texts.label-v2-2-x') },
  { value: 'v3x', label: t('tools.docker-run-to-docker-compose-converter.texts.label-v2-3-x') },
  { value: 'latest', label: t('tools.docker-run-to-docker-compose-converter.texts.label-commonspec') },
];

const conversionResult = computed(() => {
  try {
    return { yaml: composerize(dockerRuns.value.trim(), existingDockerComposeFile.value, format.value, indentSize.value), errors: [] };
  }
  catch (e: any) {
    return { yaml: '#see error messages', errors: e.toString().split('\n') };
  }
});

const dockerCompose = computed(() => conversionResult.value.yaml);
const errors = computed(() => conversionResult.value.errors);

const dockerComposeBase64 = computed(() => `data:application/yaml;base64,${textToBase64(dockerCompose.value)}`);
const { download } = useDownloadFileFromBase64({ source: dockerComposeBase64, filename: 'docker-compose.yml' });

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div>
    <c-input-text
      v-model:value="dockerRuns"
      :label="t('tools.docker-run-to-docker-compose-converter.texts.label-your-docker-run-command-s')"
      style="font-family: monospace"
      multiline
      raw-text
      monospace
      :placeholder="t('tools.docker-run-to-docker-compose-converter.texts.placeholder-your-docker-run-command-s-to-convert')"
      rows="4"
    />

    <n-divider />

    <c-label :label="t('tools.docker-run-to-docker-compose-converter.texts.label-eventually-paste-your-existing-docker-compose')">
      <div relative w-full>
        <c-monaco-editor
          v-model:value="existingDockerComposeFile"
          theme="vs-dark"
          language="yaml"
          height="100px"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </c-label>

    <n-divider />

    <n-grid cols="4" x-gap="12" w-full>
      <n-gi span="2">
        <c-select
          v-model:value="format"
          label-position="top"
          :label="t('tools.docker-run-to-docker-compose-converter.texts.label-docker-compose-format')"
          :options="formatOptions"
          :placeholder="t('tools.docker-run-to-docker-compose-converter.texts.placeholder-select-docker-compose-format')"
        />
      </n-gi>
      <n-gi span="2">
        <n-form-item :label="t('tools.docker-run-to-docker-compose-converter.texts.label-indent-size')" label-placement="top" label-width="100" :show-feedback="false">
          <n-input-number-i18n v-model:value="indentSize" min="0" max="10" w-100px />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-divider />

    <TextareaCopyable :value="dockerCompose" language="yaml" />

    <div mt-5 flex justify-center>
      <c-button :disabled="dockerCompose === ''" secondary @click="download">
        {{ t('tools.docker-run-to-docker-compose-converter.texts.tag-download-docker-compose-yml') }}
      </c-button>
    </div>

    <div v-if="errors.length > 0">
      <n-alert :title="t('tools.docker-run-to-docker-compose-converter.texts.title-the-following-errors-occured')" type="error" mt-5>
        <ul>
          <li v-for="(message, index) of errors" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>
  </div>
</template>
