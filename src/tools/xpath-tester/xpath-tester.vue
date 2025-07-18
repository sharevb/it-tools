<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import XPathEngine from 'xpath';
import { DOMParser } from '@xmldom/xmldom';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';

const { t } = useI18n();

const xpath = ref('//title');
const xml = ref('<book><title>Harry Potter</title></book>');

const selectedNodes = computed(() => {
  try {
    const doc = new DOMParser().parseFromString(xml.value, 'text/xml');
    const select = XPathEngine.useNamespaces(Object.fromEntries(
      [...xml.value.matchAll(/xmlns\:([^\=]+)\=["']([^"']+)["']/g)].map(
        ([_, prefix, uri]) => [prefix, uri],
      )));
    const result = select(xpath.value, doc);
    return Array.isArray(result) ? result : [result];
  }
  catch (e: any) {
    return [e.toString()];
  }
});

const xmlValidation = useValidation({
  source: xml,
  rules: [
    {
      validator: v => isNotThrowing(() => new DOMParser().parseFromString(v, 'text/xml')),
      message: t('tools.xpath-tester.texts.message-provided-xml-is-not-valid'),
    },
  ],
});
</script>

<template>
  <div>
    <c-card :title="t('tools.xpath-tester.texts.title-input')" mb-2>
      <c-input-text
        v-model:value="xpath"
        :label="t('tools.xpath-tester.texts.label-xpath-expression')"
        :placeholder="t('tools.xpath-tester.texts.placeholder-put-your-xpath-expression-here')"
        mb-2
      />

      <c-input-text
        v-model:value="xml"
        :label="t('tools.xpath-tester.texts.label-xml')"
        multiline
        :placeholder="t('tools.xpath-tester.texts.placeholder-put-your-xml-here')"
        rows="5"
        :validation="xmlValidation"
        mb-2
      />
    </c-card>

    <c-card :title="t('tools.xpath-tester.texts.title-result-s')">
      <ul v-if="selectedNodes?.length > 0">
        <li v-for="(node, index) in selectedNodes" :key="index">
          {{ node }}
        </li>
      </ul>
      <c-alert v-if="!selectedNodes?.length">
        {{ t('tools.xpath-tester.texts.tag-xpath-expression-selected-nothing') }}
      </c-alert>
    </c-card>
  </div>
</template>
