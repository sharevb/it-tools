<script setup lang="ts">
import { toStrictXhtml } from './html-to-xhtml.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const inputHtml = ref('');
const addNamespace = ref(false);
const indentation = ref(2);
const outputHtml = computed(() => {
  try {
    return toStrictXhtml(
      inputHtml.value,
      {
        addNamespace: addNamespace.value,
        indent: indentation.value,
      },
    );
  }
  catch (e: any) {
    return `<!-- ERROR: ${e.toString()} -->`;
  }
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputHtml"
      multiline raw-text
      placeholder="Your HTML content..."
      rows="8"
      autofocus
      label="Your HTML to convert to XHTML:"
      paste-html
      mb-1
    />

    <n-space justify="center" mb-2>
      <n-form-item label="Add XHTML xmlns:" label-placement="left">
        <n-switch v-model:value="addNamespace" />
      </n-form-item>
      <n-form-item label="Indentation:" label-placement="left">
        <n-input-number v-model:value="indentation" :min="0" />
      </n-form-item>
    </n-space>

    <c-card v-if="outputHtml" title="Output XHTML:">
      <TextareaCopyable
        :value="outputHtml"
        multiline
        language="html"
        download-file-name="output.xhtml"
        :word-wrap="true"
      />
    </c-card>
  </div>
</template>
