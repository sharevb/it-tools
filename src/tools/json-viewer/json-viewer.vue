<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  get,
} from '@vueuse/core';
import { formatJson } from './json.models';
import { useJsonSchemaValidation } from './useJsonSchemaValidation';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';
import { useITStorage, useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const inputElement = ref<HTMLElement>();
const jsonSchemaInputElement = ref<HTMLElement>();
const repairJsonLabel = t('tools.json-viewer.text.repair-json');

const rawJson = useITStorage('json-prettify:raw-json', '{"hello": "world", "foo": "bar"}');
const schemaData = useITStorage('json-prettify:schema-data', '');
const indentSize = useITStorage('json-prettify:indent-size', 3);
const sortKeys = useITStorage('json-prettify:sort-keys', true);
const unescapeUnicode = useITStorage('json-prettify:unescape-unicode', false);
const unescapeJsonString = useITStorage('json-prettify:unescape-json', false);
const repairJson = useITStorage('json-prettify:repair-json', true);
const cleanJson = computed(() => withDefaultOnError(() => formatJson({ rawJson, indentSize, sortKeys, unescapeUnicode, unescapeJsonString, repairJson }), ''));

const rawJsonValidation = useValidation({
  source: rawJson,
  rules: [
    {
      validator: v => v === '' || formatJson({ rawJson, indentSize: 0, sortKeys: false, unescapeUnicode, unescapeJsonString, repairJson }),
      get message() {
        return t('tools.json-viewer.text.provided-json-is-not-valid') + (!get(repairJson) ? t('tools.json-viewer.text.try-again-with-repairjsonlabel', [repairJsonLabel]) : '');
      },
    },
  ],
  watch: [repairJson, unescapeUnicode, unescapeJsonString],
});

const schemaUrl = useQueryParamOrStorage<string>({ name: 'schema', storageName: 'json-prettify:schema', defaultValue: '' });
const { schemas, errors: validationErrors } = useJsonSchemaValidation({ json: rawJson, schemaUrl, schemaData });
</script>

<template>
  <n-space justify="center">
    <n-form-item :label="t('tools.json-viewer.texts.label-sort-keys')" label-placement="left" label-width="100">
      <n-switch v-model:value="sortKeys" />
    </n-form-item>
    <n-form-item :label="t('tools.json-viewer.texts.label-unescape-unicode')" label-placement="left" label-width="150">
      <n-switch v-model:value="unescapeUnicode" />
    </n-form-item>
    <n-form-item :label="t('tools.json-viewer.texts.label-unescape-json-string')" label-placement="left" label-width="180">
      <n-switch v-model:value="unescapeJsonString" />
    </n-form-item>
    <n-form-item :label="t('tools.json-viewer.texts.label-indent-size')" label-placement="left" label-width="100" :show-feedback="false">
      <n-input-number-i18n v-model:value="indentSize" min="0" max="10" style="width: 100px" />
    </n-form-item>
    <n-form-item :label="`${repairJsonLabel} :`" label-placement="left" label-width="110">
      <n-switch v-model:value="repairJson" />
    </n-form-item>
  </n-space>

  <n-form-item :label="t('tools.json-viewer.texts.label-json-schema')" label-placement="left" label-width="130px" label-align="right">
    <n-select
      v-model:value="schemaUrl"
      :options="[
        { label: t('tools.json-viewer.texts.label-no-validation'), value: '' },
        { label: t('tools.json-viewer.texts.label-custom'), value: 'custom' },
        ...schemas.map(s => ({ label: `${s.name} / ${s.description}`, value: s.url })),
      ]"
      filterable mb-4
    />
  </n-form-item>
  <c-input-text
    v-if="schemaUrl === 'custom'"
    ref="jsonSchemaInputElement"
    v-model:value="schemaData"
    :placeholder="t('tools.json-viewer.texts.placeholder-paste-your-json-schema-here')"
    rows="20"
    multiline
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
    monospace
  />

  <n-form-item
    :label="t('tools.json-viewer.texts.label-your-raw-json')"
    :feedback="rawJsonValidation.message"
    :validation-status="rawJsonValidation.status"
  >
    <c-input-text
      ref="inputElement"
      v-model:value="rawJson"
      :placeholder="t('tools.json-viewer.texts.placeholder-paste-your-raw-json-here')"
      rows="20"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      monospace
    />
  </n-form-item>

  <div v-if="validationErrors.length > 0" mb-2 mt-2>
    <n-alert :title="t('tools.json-viewer.texts.title-schema-validation-errors')" type="error">
      <ul
        v-for="error in validationErrors"
        :key="error"
      >
        <li>{{ error }}</li>
      </ul>
    </n-alert>
  </div>

  <n-form-item :label="t('tools.json-viewer.texts.label-prettified-version-of-your-json')">
    <textarea-copyable :value="cleanJson" language="json" :follow-height-of="inputElement" download-file-name="output.json" />
  </n-form-item>
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
