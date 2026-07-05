<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JsonEditorVue from 'json-editor-vue';
import { type AfterSelection, type InsideSelection, type JSONEditorSelection, type KeySelection, type MultiSelection, type ValueSelection, isAfterSelection, isInsideSelection, isKeySelection, isMultiSelection, isValueSelection, stringifyJSONPath } from 'vanilla-jsoneditor';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';
import { jsonrepair } from 'jsonrepair';
import { useJsonSchemaValidation } from '../json-viewer/useJsonSchemaValidation';
import { useITStorage, useQueryParamOrStorage } from '@/composable/queryParams';
import { useStyleStore } from '@/stores/style.store';

const { t } = useI18n();

const styleStore = useStyleStore();

const jsonText = ref('{ "a": { "array": [1, 2, 3] } }');
const jsonPath = ref('');

function updateJsonPath(selection: JSONEditorSelection) {
  if (isAfterSelection (selection)) {
    jsonPath.value = `$.${stringifyJSONPath((selection as AfterSelection).path)}`;
  }
  else if (isInsideSelection (selection)) {
    jsonPath.value = `$.${stringifyJSONPath((selection as InsideSelection).path)}`;
  }
  else if (isKeySelection (selection)) {
    jsonPath.value = `$.${stringifyJSONPath((selection as KeySelection).path)}`;
  }
  else if (isValueSelection (selection)) {
    jsonPath.value = `$.${stringifyJSONPath((selection as ValueSelection).path)}`;
  }
  else if (isMultiSelection (selection)) {
    jsonPath.value = `$.${stringifyJSONPath((selection as MultiSelection).focusPath)}`;
  }
  else {
    jsonPath.value = 'No available in this mode';
  }
}

const jsonSchemaInputElement = ref<HTMLElement>();
const schemaData = useITStorage('json-linter:schema-data', '');

const schemaUrl = useQueryParamOrStorage<string>({ name: 'schema', storageName: 'json-editor:schema', defaultValue: '' });
const { schemas, errors: validationErrors } = useJsonSchemaValidation({ json: jsonText, schemaUrl, schemaData });

function tryAutoRepair() {
  try {
    jsonText.value = jsonrepair(jsonText.value);
  }
  catch {}
}

const indentSize = useITStorage('json-editor:indent-size', 3);
const formattedJson = computed(() => {
  const jsonTextValue = jsonText.value;
  try {
    return JSON.stringify(
      JSON.parseBigNum(jsonTextValue),
      null, indentSize.value);
  }
  catch {
    return jsonTextValue;
  }
});
</script>

<template>
  <div>
    <JsonEditorVue
      v-model="jsonText"
      mode="text"
      :class="styleStore.isDarkTheme ? 'jse-theme-dark' : ''"
      :on-select="updateJsonPath"
      mb-2
    />

    <n-space justify="center" mb-2>
      <n-button @click="tryAutoRepair">
        {{ t('tools.json-editor.texts.repair-json') }}
      </n-button>
    </n-space>

    <n-form-item :label="t('tools.json-editor.texts.label-current-selected-node-jsonpath')">
      <textarea-copyable :value="jsonPath" />
    </n-form-item>

    <n-divider />

    <n-form-item :label="t('tools.json-linter.texts.label-indent-size-0-compact')" label-placement="left">
      <n-input-number-i18n v-model:value="indentSize" min="0" max="10" style="width: 100px" />
    </n-form-item>
    <n-form-item :label="t('tools.json-editor.texts.label-your-edited-json')">
      <textarea-copyable :value="formattedJson" language="json" download-file-name="output.json" />
    </n-form-item>

    <n-form-item :label="t('tools.json-editor.texts.label-json-schema')" label-placement="left" label-width="130px" label-align="right">
      <n-select
        v-model:value="schemaUrl"
        :options="[
          { label: t('tools.json-editor.texts.label-no-validation'), value: '' },
          { label: t('tools.json-editor.texts.label-custom'), value: 'custom' },
          ...schemas.map(s => ({ label: `${s.name} / ${s.description}`, value: s.url })),
        ]"
        filterable mb-4
      />
    </n-form-item>
    <c-input-text
      v-if="schemaUrl === 'custom'"
      ref="jsonSchemaInputElement"
      v-model:value="schemaData"
      :placeholder="t('tools.json-editor.texts.placeholder-paste-your-json-schema-here')"
      rows="20"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      monospace
    />

    <div v-if="validationErrors.length > 0" mb-2 mt-2>
      <n-alert :title="t('tools.json-editor.texts.title-schema-validation-errors')" type="error">
        <ul
          v-for="error in validationErrors"
          :key="error"
        >
          <li>{{ error }}</li>
        </ul>
      </n-alert>
    </div>
  </div>
</template>
