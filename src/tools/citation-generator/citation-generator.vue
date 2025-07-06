<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { APA, MLA } from 'citation-formatter';

const { t } = useI18n();

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
  <n-card :title="t('tools.citation-generator.texts.title-citation-generator')" style="max-width: 600px; margin: auto;">
    <n-form label-placement="left" label-width="150px" :model="citationData">
      <n-form-item :label="t('tools.citation-generator.texts.label-authors-in-last-name-first-name-format')" label-placement="top">
        <n-dynamic-input
          v-model:value="citationData.authors"
          :placeholder="t('tools.citation-generator.texts.placeholder-enter-author-name')"
        />
      </n-form-item>

      <n-form-item :label="t('tools.citation-generator.texts.label-title')">
        <n-input v-model:value="citationData.title" :placeholder="t('tools.citation-generator.texts.placeholder-e-g-introduction-to-vue-3')" :status="citationData.title ? 'success' : 'error'" />
      </n-form-item>

      <n-form-item :label="t('tools.citation-generator.texts.label-publisher')">
        <n-input v-model:value="citationData.publisher" :placeholder="t('tools.citation-generator.texts.placeholder-e-g-o-reilly-media')" :status="citationData.publisher ? 'success' : 'error'" />
      </n-form-item>

      <n-form-item :label="t('tools.citation-generator.texts.label-publication-year')">
        <n-input-number v-model:value="citationData.year" :min="0" :status="citationData.year ? 'success' : 'error'" />
      </n-form-item>

      <n-form-item :label="t('tools.citation-generator.texts.label-url-optional')">
        <n-input v-model:value="citationData.url" :placeholder="t('tools.citation-generator.texts.placeholder-e-g-https-example-com')" />
      </n-form-item>

      <n-form-item :label="t('tools.citation-generator.texts.label-citation-style')">
        <n-select
          v-model:value="style"
          :options="[
            { label: t('tools.citation-generator.texts.label-apa'), value: 'apa' },
            { label: t('tools.citation-generator.texts.label-mla'), value: 'mla' },
          ]"
        />
      </n-form-item>
    </n-form>

    <n-divider />

    <c-card :title="t('tools.citation-generator.texts.title-generated-citation')">
      <textarea-copyable :value="formattedCitation" />
    </c-card>
  </n-card>
</template>
