<script setup lang="ts">
import { ref } from 'vue';
import { APA, MLA } from 'citation-formatter';

const citationData = ref({
  authors: [''],
  title: '',
  publisher: '',
  year: '',
  url: '',
});

const style = ref('apa');
const formattedCitation = computed(() => {
  try {
    const authors = citationData.value.authors.filter(a => a.trim() !== '').map((a) => {
      const [first, last] = a.split(/,\s*/, 2);
      return { first, last };
    });
    if (!citationData.value.title
      || !citationData.value.publisher
      || !citationData.value.year
      || !authors.length
    ) { return '### Please fill Title, Publisher, Year and authors'; }
    return (style.value === 'apa' ? APA : MLA)([
      {
        authors,
        title: citationData.value.title,
        publisher: citationData.value.publisher,
        year: citationData.value.year,
        url: citationData.value.url,
      }]);
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <n-card title="Citation Generator" style="max-width: 600px; margin: auto;">
    <n-form label-placement="left" label-width="150px" :model="citationData">
      <n-form-item label="Authors (in Last Name, First Name format):" label-placement="top">
        <n-dynamic-input
          v-model:value="citationData.authors"
          placeholder="Enter author name"
        />
      </n-form-item>

      <n-form-item label="Title:">
        <n-input v-model:value="citationData.title" placeholder="e.g. Introduction to Vue 3" :status="citationData.title ? 'success' : 'error'" />
      </n-form-item>

      <n-form-item label="Publisher:">
        <n-input v-model:value="citationData.publisher" placeholder="e.g. O'Reilly Media" :status="citationData.publisher ? 'success' : 'error'" />
      </n-form-item>

      <n-form-item label="Publication Year:">
        <n-input-number v-model:value="citationData.year" :min="0" :status="citationData.year ? 'success' : 'error'" />
      </n-form-item>

      <n-form-item label="URL (optional):">
        <n-input v-model:value="citationData.url" placeholder="e.g. https://example.com" />
      </n-form-item>

      <n-form-item label="Citation Style">
        <n-select
          v-model:value="style"
          :options="[
            { label: 'APA', value: 'apa' },
            { label: 'MLA', value: 'mla' },
          ]"
        />
      </n-form-item>
    </n-form>

    <n-divider />

    <c-card title="Generated Citation">
      <textarea-copyable :value="formattedCitation" />
    </c-card>
  </n-card>
</template>
