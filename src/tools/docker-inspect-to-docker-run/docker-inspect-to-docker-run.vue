<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parse } from 'rekcod';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const dockerInspect = ref('');

const conversionResult = computed(() => {
  const inspects = dockerInspect.value.trim();
  if (!inspects) {
    return { commands: '', errors: [] };
  }
  try {
    return { commands: parse(inspects).map(c => c.command).join('\n'), errors: [] };
  }
  catch (e: any) {
    return { commands: '#see error messages', errors: e.toString().split('\n') };
  }
});

const errors = computed(() => conversionResult.value.errors);
const dockerRunCommand = computed(() => conversionResult.value.commands);

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div>
    <c-label :label="t('tools.docker-inspect-to-docker-run.texts.label-paste-your-docker-inspect-json-output')">
      <div relative w-full>
        <c-monaco-editor
          v-model:value="dockerInspect"
          theme="vs-dark"
          language="json"
          height="250px"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </c-label>

    <div v-if="errors.length > 0">
      <n-alert :title="t('tools.docker-inspect-to-docker-run.texts.title-the-following-errors-occured')" type="error" mt-5>
        <ul>
          <li v-for="(message, index) of errors" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>

    <n-divider />

    <TextareaCopyable :value="dockerRunCommand" language="bash" copy-placement="outside" />
  </div>
</template>
