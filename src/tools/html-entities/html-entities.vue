<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { escape, unescape } from 'lodash';

import { useCopy } from '@/composable/copy';

const { t } = useI18n();

const escapeInput = ref('<title>IT Tool</title>');
const escapeOutput = computed(() => escape(escapeInput.value));
const { copy: copyEscaped } = useCopy({ source: escapeOutput });

const unescapeInput = ref('&lt;title&gt;IT Tool&lt;/title&gt;');
const unescapeOutput = computed(() => unescape(unescapeInput.value));
const { copy: copyUnescaped } = useCopy({ source: unescapeOutput });
</script>

<template>
  <c-card :title="t('tools.html-entities.texts.title-escape-html-entities')">
    <n-form-item :label="t('tools.html-entities.texts.label-your-string')">
      <c-input-text
        v-model:value="escapeInput"
        multiline
        :placeholder="t('tools.html-entities.texts.placeholder-the-string-to-escape')"
        rows="3"
        autosize
        raw-text
      />
    </n-form-item>

    <n-form-item :label="t('tools.html-entities.texts.label-your-string-escaped')">
      <c-input-text
        multiline
        readonly
        :placeholder="t('tools.html-entities.texts.placeholder-your-string-escaped')"
        :value="escapeOutput"
        rows="3"
        autosize
      />
    </n-form-item>

    <div flex justify-center>
      <c-button @click="copyEscaped()">
        {{ t('tools.html-entities.texts.tag-copy') }}
      </c-button>
    </div>
  </c-card>
  <c-card :title="t('tools.html-entities.texts.title-unescape-html-entities')">
    <n-form-item :label="t('tools.html-entities.texts.label-your-escaped-string')">
      <c-input-text
        v-model:value="unescapeInput"
        multiline
        :placeholder="t('tools.html-entities.texts.placeholder-the-string-to-unescape')"
        rows="3"
        autosize
        raw-text
      />
    </n-form-item>

    <n-form-item :label="t('tools.html-entities.texts.label-your-string-unescaped')">
      <c-input-text
        :value="unescapeOutput"
        multiline
        readonly
        :placeholder="t('tools.html-entities.texts.placeholder-your-string-unescaped')"
        rows="3"
        autosize
      />
    </n-form-item>

    <div flex justify-center>
      <c-button @click="copyUnescaped()">
        {{ t('tools.html-entities.texts.tag-copy') }}
      </c-button>
    </div>
  </c-card>
</template>
