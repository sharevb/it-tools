<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { XMLParser } from 'fast-xml-parser';

const { t } = useI18n();

const parser = new XMLParser();

const xmlContent = ref('');
const lintErrors = computed(() => {
  const xml = xmlContent.value?.trim();
  try {
    if (xml) {
      parser.parse(xml, true);
    }
    return '';
  }
  catch (e: any) {
    return e.toString().trim();
  }
});

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div>
    <n-card :title="t('tools.xml-linter.texts.title-your-xml-content')" mb-2>
      <div relative w-full>
        <c-monaco-editor
          v-model:value="xmlContent"
          theme="vs-dark"
          height="250px"
          language="xml"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </n-card>

    <div v-if="lintErrors">
      <n-alert type="error" :title="t('tools.xml-linter.texts.title-linting-error')" :show-icon="true">
        <pre>{{ lintErrors }}</pre>
      </n-alert>
    </div>
    <div v-else-if="xmlContent">
      <n-alert type="success" :title="t('tools.xml-linter.texts.title-valid-xml')" :show-icon="true">
        {{ t('tools.xml-linter.texts.tag-no-errors-found-your-xml-is-valid') }}
      </n-alert>
    </div>
  </div>
</template>
