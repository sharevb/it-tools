<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { toStrictXhtml } from './html-to-xhtml.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

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
      :placeholder="t('tools.html-to-xhtml.texts.placeholder-your-html-content')"
      rows="8"
      autofocus
      :label="t('tools.html-to-xhtml.texts.label-your-html-to-convert-to-xhtml')"
      paste-html
      mb-1
    />

    <n-space justify="center" mb-2>
      <n-form-item :label="t('tools.html-to-xhtml.texts.label-add-xhtml-xmlns')" label-placement="left">
        <n-switch v-model:value="addNamespace" />
      </n-form-item>
      <n-form-item :label="t('tools.html-to-xhtml.texts.label-indentation')" label-placement="left">
        <n-input-number v-model:value="indentation" :min="0" />
      </n-form-item>
    </n-space>

    <c-card v-if="outputHtml" :title="t('tools.html-to-xhtml.texts.title-output-xhtml')">
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
