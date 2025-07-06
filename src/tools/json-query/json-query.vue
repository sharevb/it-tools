<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import JSON5 from 'json5';
import { jsonquery } from '@jsonquerylang/jsonquery';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const indent = 2;

const jsonQuery = ref(`
  .friends 
    | filter(.city == "New York") 
    | sort(.age) 
    | pick(.name, .age)
`);
const json = ref(`{
  "friends": [
    { "name": "Chris", "age": 23, "city": "New York" },
    { "name": "Emily", "age": 19, "city": "Atlanta" },
    { "name": "Joe", "age": 32, "city": "New York" },
    { "name": "Kevin", "age": 19, "city": "Atlanta" },
    { "name": "Michelle", "age": 27, "city": "Los Angeles" },
    { "name": "Robert", "age": 45, "city": "Manhattan" },
    { "name": "Sarah", "age": 31, "city": "New York" }
  ]
}`);

const result = computed(() => {
  try {
    const obj = JSON5.parse(json.value);
    return JSON.stringify(jsonquery(obj, jsonQuery.value), null, indent);
  }
  catch (e: any) {
    return e.toString();
  }
});

const jsonValidation = useValidation({
  source: json,
  rules: [
    {
      validator: v => JSON5.parse(v),
      message: t('tools.json-query.texts.message-provided-json-is-not-valid'),
    },
  ],
});
</script>

<template>
  <div>
    <c-card :title="t('tools.json-query.texts.title-input')" mb-2>
      <c-input-text
        v-model:value="jsonQuery"
        :label="t('tools.json-query.texts.label-json-query')"
        :placeholder="t('tools.json-query.texts.placeholder-put-your-json-query-string-here')"
        mb-2
      />

      <div mb-2 flex justify-center>
        <n-a target="_blank" href="https://jsonquerylang.org/docs/">
          {{ t('tools.json-query.texts.tag-see-json-query-lang-documentation') }}
        </n-a>
      </div>

      <c-input-text
        v-model:value="json"
        :label="t('tools.json-query.texts.label-json')"
        multiline
        :placeholder="t('tools.json-query.texts.placeholder-put-your-json-here')"
        rows="5"
        :validation="jsonValidation"
        mb-2
      />
    </c-card>

    <c-card :title="t('tools.json-query.texts.title-result')">
      <TextareaCopyable :value="result" language="json" />
    </c-card>
  </div>
</template>
