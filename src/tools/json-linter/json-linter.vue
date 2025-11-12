<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import linter from 'jsonlint-mod';
import { useJsonSchemaValidation } from '../json-viewer/useJsonSchemaValidation';
import { useITStorage, useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const jsonSchemaInputElement = ref<HTMLElement>();
const schemaData = useITStorage('json-linter:schema-data', '');

const jsonContent = ref(
  `{ 
    a: True; 
    b=5 
  }`,
);

const conversionError = computed(() => {
  try {
    linter.parse(jsonContent.value);
    return null;
  }
  catch (e: any) {
    return e.toString();
  }
});

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};

const schemaUrl = useQueryParamOrStorage<string>({ name: 'schema', storageName: 'json-linter:schema', defaultValue: '' });
const { schemas, errors: validationErrors } = useJsonSchemaValidation({ json: jsonContent, schemaUrl, schemaData });

const indentSize = useITStorage('json-linter:indent-size', 3);
const cleanJson = computed(() => {
  try {
    return JSON.stringify(JSON.parseBigInt(jsonContent.value), null, indentSize.value);
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <c-label :label="t('tools.json-linter.texts.label-paste-your-json-file-content')" mb-2>
      <div relative w-full>
        <c-monaco-editor
          v-model:value="jsonContent"
          theme="vs-dark"
          language="yaml"
          height="250px"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </c-label>

    <n-form-item :label="t('tools.json-linter.texts.label-json-schema')" label-placement="left" label-width="130px" label-align="right">
      <n-select
        v-model:value="schemaUrl"
        :options="[
          { label: t('tools.json-linter.texts.label-no-validation'), value: '' },
          { label: t('tools.json-linter.texts.label-custom'), value: 'custom' },
          ...schemas.map(s => ({ label: `${s.name} / ${s.description}`, value: s.url })),
        ]"
        filterable mb-4
      />
    </n-form-item>
    <c-input-text
      v-if="schemaUrl === 'custom'"
      ref="jsonSchemaInputElement"
      v-model:value="schemaData"
      :placeholder="t('tools.json-linter.texts.placeholder-paste-your-json-schema-here')"
      rows="20"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      monospace
    />

    <div v-if="validationErrors.length > 0" mb-2 mt-2>
      <n-alert :title="t('tools.json-linter.texts.title-schema-validation-errors')" type="error">
        <ul
          v-for="error in validationErrors"
          :key="error"
        >
          <li>{{ error }}</li>
        </ul>
      </n-alert>
    </div>

    <div v-if="conversionError">
      <n-alert :title="t('tools.json-linter.texts.title-the-following-errors-occured')" type="error" mt-5>
        <pre>
        {{ conversionError }}
        </pre>
      </n-alert>
    </div>
    <div v-else>
      <n-alert type="success" mt-5>
        {{ t('tools.json-linter.texts.tag-validation-successful') }}
      </n-alert>
    </div>

    <c-card v-if="!conversionError" :title="t('tools.json-linter.texts.title-formatted-version')" mt-5>
      <n-form-item :label="t('tools.json-linter.texts.label-indent-size-0-compact')" label-placement="left">
        <n-input-number-i18n v-model:value="indentSize" min="0" max="10" style="width: 100px" />
      </n-form-item>
      <textarea-copyable :value="cleanJson" language="json" />
    </c-card>
  </div>
</template>
