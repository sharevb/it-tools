<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { formatYaml } from './yaml-models';
import { useYamlSchemaValidation } from './useYamlSchemaValidation';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useITStorage, useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const jsonSchemaInputElement = ref<HTMLElement>();

const rawYaml = useITStorage('yaml-prettify:raw-yaml', '');
const schemaData = useITStorage('yaml-prettify:schema-data', '');
const indentSize = useITStorage('yaml-prettify:indent-size', 2);
const sortKeys = useITStorage('yaml-prettify:sort-keys', false);

const yamlFormattingResult = computed(() => {
  try {
    return { yaml: formatYaml({ rawYaml, indentSize, sortKeys }), errors: [] };
  }
  catch (e: any) {
    return { yaml: t('tools.yaml-viewer.text.see-error-messages'), errors: e.toString().split('\n') };
  }
});
const errors = computed(() => yamlFormattingResult.value.errors);
const cleanYaml = computed(() => yamlFormattingResult.value.yaml);

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};

const schemaUrl = useQueryParamOrStorage({ name: 'schema', storageName: 'yaml-prettify:schema', defaultValue: '' });
const { schemas, errors: validationErrors } = useYamlSchemaValidation({ yaml: rawYaml, schemaUrl, schemaData });
</script>

<template>
  <div>
    <div style="flex: 0 0 100%">
      <div style="margin: 0 auto; max-width: 600px" flex justify-center gap-3>
        <n-form-item :label="t('tools.yaml-viewer.texts.label-sort-keys')" label-placement="left" label-width="100">
          <n-switch v-model:value="sortKeys" />
        </n-form-item>
        <n-form-item :label="t('tools.yaml-viewer.texts.label-indent-size')" label-placement="left" label-width="100" :show-feedback="false">
          <n-input-number-i18n v-model:value="indentSize" min="1" max="10" style="width: 100px" />
        </n-form-item>
      </div>
    </div>

    <n-form-item :label="t('tools.yaml-viewer.texts.label-json-schema')" label-placement="left" label-width="130px" label-align="right">
      <n-select
        v-model:value="schemaUrl"
        :options="[
          { label: t('tools.yaml-viewer.texts.label-no-validation'), value: '' },
          { label: t('tools.yaml-viewer.texts.label-custom'), value: 'custom' },
          ...schemas.map(s => ({ label: `${s.name} / ${s.description}`, value: s.url })),
        ]"
        filterable mb-4
      />
    </n-form-item>
    <c-input-text
      v-if="schemaUrl === 'custom'"
      ref="jsonSchemaInputElement"
      v-model:value="schemaData"
      :placeholder="t('tools.yaml-viewer.texts.placeholder-paste-your-json-schema-here')"
      rows="20"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      monospace
    />

    <c-label :label="t('tools.yaml-viewer.texts.label-your-raw-yaml')">
      <div relative w-full>
        <c-monaco-editor
          v-model:value="rawYaml"
          theme="vs-dark"
          language="yaml"
          height="250px"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </c-label>

    <div v-if="errors.length > 0" mb-2 mt-2>
      <n-alert :title="t('tools.yaml-viewer.texts.title-the-following-errors-occured')" type="error" mt-5>
        <ul>
          <li v-for="(message, index) of errors" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>

    <div v-if="validationErrors.length > 0" mb-2 mt-2>
      <n-alert :title="t('tools.yaml-viewer.texts.title-schema-validation-errors')" type="error">
        <ul
          v-for="error in validationErrors"
          :key="error"
        >
          <li>{{ error }}</li>
        </ul>
      </n-alert>
    </div>

    <n-divider />

    <n-form-item :label="t('tools.yaml-viewer.texts.label-prettified-version-of-your-yaml')">
      <TextareaCopyable :value="cleanYaml" language="yaml" download-file-name="output.yml" />
    </n-form-item>
  </div>
</template>

  <style lang="less" scoped>
    .result-card {
    position: relative;
    .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
    }
    }
  </style>
