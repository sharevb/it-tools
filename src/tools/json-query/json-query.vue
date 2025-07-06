<script setup lang="ts">
import JSON5 from 'json5';
import { jsonquery } from '@jsonquerylang/jsonquery';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';

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
      message: 'Provided JSON is not valid.',
    },
  ],
});
</script>

<template>
  <div>
    <c-card title="Input" mb-2>
      <c-input-text
        v-model:value="jsonQuery"
        label="JSON Query"
        placeholder="Put your JSON Query string here..."
        mb-2
      />

      <div mb-2 flex justify-center>
        <n-a target="_blank" href="https://jsonquerylang.org/docs/">
          See JSON Query lang documentation
        </n-a>
      </div>

      <c-input-text
        v-model:value="json"
        label="JSON"
        multiline
        placeholder="Put your JSON here..."
        rows="5"
        :validation="jsonValidation"
        mb-2
      />
    </c-card>

    <c-card title="Result">
      <TextareaCopyable :value="result" language="json" />
    </c-card>
  </div>
</template>
