<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parse as parseToml } from 'smol-toml';

const { t } = useI18n();

const tomlContent = ref('');
const lintErrors = computed(() => {
  try {
    parseToml(tomlContent.value);
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
    <n-card :title="t('tools.toml-linter.texts.title-your-toml-content')" mb-2>
      <div relative w-full>
        <c-monaco-editor
          v-model:value="tomlContent"
          theme="vs-dark"
          height="250px"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </n-card>

    <div v-if="lintErrors">
      <n-alert type="error" :title="t('tools.toml-linter.texts.title-linting-error')" :show-icon="true">
        <pre>{{ lintErrors }}</pre>
      </n-alert>
    </div>
    <div v-else-if="tomlContent">
      <n-alert type="success" :title="t('tools.toml-linter.texts.title-valid-toml')" :show-icon="true">
        {{ t('tools.toml-linter.texts.tag-no-errors-found-your-toml-is-valid') }}
      </n-alert>
    </div>
  </div>
</template>
