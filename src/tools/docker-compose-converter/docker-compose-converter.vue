<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Composeverter from 'composeverter';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { textToBase64 } from '@/utils/base64';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const dockerCompose = ref(
  `nginx:
    ports:
        - '80:80'
    volumes:
        - '/var/run/docker.sock:/tmp/docker.sock:ro'
    image: nginx`,
);
const indentSize = useQueryParamOrStorage({ name: 'indent', storageName: 'docker-compose-converter:indent-size', defaultValue: 4 });

const expandVolumes = ref(
  false,
);
const expandPorts = ref(
  false,
);
const conversion = useQueryParamOrStorage({ name: 'conv', storageName: 'docker-compose-converter:conversion', defaultValue: 'latest' });
const conversionOptions = [
  { value: 'v1ToV2x', label: t('tools.docker-compose-converter.texts.label-v1-to-v2-2-x') },
  { value: 'v1ToV3x', label: t('tools.docker-compose-converter.texts.label-v1-to-v2-3-x') },
  { value: 'v2xToV3x', label: t('tools.docker-compose-converter.texts.label-v2-2-x-to-3-x') },
  { value: 'v3xToV2x', label: t('tools.docker-compose-converter.texts.label-v2-3-x-to-2-x') },
  { value: 'latest', label: t('tools.docker-compose-converter.texts.label-to-commonspec') },
];

const conversionResult = computed(() => {
  try {
    let convertedDockerCompose = '';
    const config = {
      expandPorts: expandPorts.value,
      expandVolumes: expandVolumes.value,
      indent: indentSize.value,
    };
    switch (conversion.value) {
      case 'latest':
        convertedDockerCompose = Composeverter.migrateToCommonSpec(dockerCompose.value, config);
        break;
      case 'v1ToV2x':
        convertedDockerCompose = Composeverter.migrateFromV1ToV2x(dockerCompose.value, config);
        break;
      case 'v1ToV3x':
        convertedDockerCompose = Composeverter.migrateFromV2xToV3x(Composeverter.migrateFromV1ToV2x(dockerCompose.value), config);
        break;
      case 'v2xToV3x':
        convertedDockerCompose = Composeverter.migrateFromV2xToV3x(dockerCompose.value, config);
        break;
      case 'v3xToV2x':
        convertedDockerCompose = Composeverter.migrateFromV3xToV2x(dockerCompose.value, config);
        break;

      default:
        throw new Error(`Unknown conversion '${conversion}'`);
    }
    return { yaml: convertedDockerCompose, errors: [] };
  }
  catch (e: any) {
    return { yaml: '#see error messages', errors: e.toString().split('\n') };
  }
});

const convertedDockerCompose = computed(() => conversionResult.value.yaml);
const errors = computed(() => conversionResult.value.errors);

const convertedDockerComposeBase64 = computed(() => `data:application/yaml;base64,${textToBase64(convertedDockerCompose.value)}`);
const { download } = useDownloadFileFromBase64({ source: convertedDockerComposeBase64, filename: 'docker-compose.yml' });

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div>
    <c-label :label="t('tools.docker-compose-converter.texts.label-paste-your-existing-docker-compose')">
      <div relative w-full>
        <c-monaco-editor
          v-model:value="dockerCompose"
          theme="vs-dark"
          language="yaml"
          height="200px"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </c-label>

    <div v-if="errors.length > 0">
      <n-alert :title="t('tools.docker-compose-converter.texts.title-the-following-errors-occured')" type="error" mt-5>
        <ul>
          <li v-for="(message, index) of errors" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>

    <n-divider />

    <n-grid cols="4" x-gap="12" w-full>
      <n-gi span="2">
        <c-select
          v-model:value="conversion"
          label-position="top"
          :label="t('tools.docker-compose-converter.texts.label-docker-compose-conversion')"
          :options="conversionOptions"
          :placeholder="t('tools.docker-compose-converter.texts.placeholder-select-docker-compose-conversion')"
        />
      </n-gi>
      <n-gi span="2">
        <n-form-item :label="t('tools.docker-compose-converter.texts.label-indent-size')" label-placement="top" label-width="100" :show-feedback="false">
          <n-input-number-i18n v-model:value="indentSize" min="0" max="10" w-100px />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-divider />

    <div class="mb-6 flex flex-row items-center gap-2">
      <n-checkbox v-model:checked="expandPorts">
        {{ t('tools.docker-compose-converter.texts.tag-expand-ports') }}
      </n-checkbox>
      <n-checkbox v-model:checked="expandVolumes">
        {{ t('tools.docker-compose-converter.texts.tag-expand-volumes') }}
      </n-checkbox>
    </div>

    <n-divider />

    <TextareaCopyable :value="convertedDockerCompose" language="yaml" />

    <div mt-5 flex justify-center>
      <c-button :disabled="dockerCompose === ''" secondary @click="download">
        {{ t('tools.docker-compose-converter.texts.tag-download-converted-docker-compose-yml') }}
      </c-button>
    </div>
  </div>
</template>
