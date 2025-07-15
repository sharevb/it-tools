<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  validateDockerComposeToCommonSpec,
} from 'composeverter';

const { t } = useI18n();

const dockerCompose = ref(
  `version: '3.3'
services:
    nginx:
        ports:
            - '80:80'
        volumes:
            - '/var/run/docker.sock:/tmp/docker.sock:ro'
        restart: always
        logging:
            options:
                max-size: 1g
        image: nginx`,
);

const conversionResult = computed(() => {
  try {
    return validateDockerComposeToCommonSpec(dockerCompose.value);
  }
  catch (e: any) {
    return e.toString().split('\n').map((err: string) => ({ line: -1, message: err, helpLink: '' }));
  }
});

const errors = computed(() => conversionResult.value);

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div>
    <c-label :label="t('tools.docker-compose-validator.texts.label-paste-your-docker-compose-file-content')">
      <div relative w-full>
        <c-monaco-editor
          v-model:value="dockerCompose"
          theme="vs-dark"
          language="yaml"
          height="250px"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </c-label>

    <div v-if="errors.length > 0">
      <n-alert :title="t('tools.docker-compose-validator.texts.title-the-following-errors-occured')" type="error" mt-5>
        <ul>
          <li v-for="(message, index) of errors" :key="index">
            {{ message.message }} (<n-a v-if="message.helpLink" target="_blank" rel="noreferer noopener">
              {{ t('tools.docker-compose-validator.texts.tag-see-docker-compose-help') }}
            </n-a>{{ t('tools.docker-compose-validator.texts.tag-') }}
          </li>
        </ul>
      </n-alert>
    </div>
    <div v-else>
      <n-alert type="success" mt-5>
        {{ t('tools.docker-compose-validator.texts.tag-validation-successful') }}
      </n-alert>
    </div>
  </div>
</template>
