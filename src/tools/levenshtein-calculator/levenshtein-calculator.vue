<script setup lang="ts">
import levenshtein from 'damerau-levenshtein';

const stringA = ref('');
const stringB = ref('');
const result = computed(() => levenshtein(stringA.value, stringB.value));
</script>

<template>
  <c-input-text v-model:value="stringA" label="First string:" label-position="left" placeholder="Enter first string" mb-1 />
  <c-input-text v-model:value="stringB" label="Second string:" label-position="left" placeholder="Enter second string" mb-1 />

  <n-divider />

  <c-card v-if="result" title="Results">
    <input-copyable label="Distance" label-position="left" :value="result.steps" mb-1 />
    <input-copyable label="Relative Distance" label-position="left" :value="result.relative" mb-1 />
    <input-copyable label="Similarity" label-position="left" :value="result.similarity" mb-1 />
  </c-card>
</template>
