<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import xPathToCss from 'xpath-to-css';
import cssToXpath from 'csstoxpath';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const cssInput = ref('');
const xpathOutput = computed(
  () => {
    try {
      return cssToXpath(cssInput.value);
    }
    catch (e: any) {
      return e.toString();
    }
  },
);

const xpathInput = ref('');
const cssOutput = computed(
  () => {
    try {
      return xPathToCss(xpathInput.value);
    }
    catch (e: any) {
      return e.toString();
    }
  },
);
</script>

<template>
  <div max-w-600>
    <c-card :title="t('tools.css-xpath-converter.texts.title-css-to-xpath')">
      <c-input-text
        v-model:value="cssInput"
        :placeholder="t('tools.css-xpath-converter.texts.placeholder-put-your-css-selector-here')"
        :label="t('tools.css-xpath-converter.texts.label-css-selector-to-convert')"
        raw-text
        mb-5
      />

      <router-link target="_blank" to="/css-selectors-memo" mb-1 mt-1>
        {{ t('tools.css-xpath-converter.texts.tag-see-css-selectors-cheatsheet') }}
      </router-link>

      <n-divider />

      <TextareaCopyable
        :label="t('tools.css-xpath-converter.texts.label-xpath-expression')"
        :value="xpathOutput"
        readonly
        mb-5
      />
    </c-card>

    <c-card :title="t('tools.css-xpath-converter.texts.title-xpath-to-css')" mt-5>
      <c-input-text
        v-model:value="xpathInput"
        :placeholder="t('tools.css-xpath-converter.texts.placeholder-put-your-xpath-expression-here')"
        :label="t('tools.css-xpath-converter.texts.label-xpath-expression-to-convert')"
        raw-text
        mb-5
      />

      <router-link target="_blank" to="/xpath-memo" mb-1 mt-1>
        {{ t('tools.css-xpath-converter.texts.tag-see-xpath-cheatsheet') }}
      </router-link>

      <n-divider />

      <TextareaCopyable
        :label="t('tools.css-xpath-converter.texts.label-css-selector')"
        :value="cssOutput"
        readonly
        mb-5
      />
    </c-card>
  </div>
</template>
