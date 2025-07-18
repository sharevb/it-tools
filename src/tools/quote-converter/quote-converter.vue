<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import toDoubleQuotes from 'to-double-quotes';
import toSingleQuotes from 'to-single-quotes';

const { t } = useI18n();
</script>

<template>
  <div>
    <c-card :title="t('tools.quote-converter.texts.title-single-quotes-to-double-quotes')" mb-2>
      <format-transformer
        :input-label="t('tools.quote-converter.texts.input-label-single-quoted-string')"
        :input-placeholder="t('tools.quote-converter.texts.input-placeholder-paste-your-single-quoted-string-here')"
        :output-label="t('tools.quote-converter.texts.output-label-double-quoted-string')"
        :transformer="toDoubleQuotes"
      />
    </c-card>

    <c-card :title="t('tools.quote-converter.texts.title-double-quotes-to-single-quotes')">
      <format-transformer
        :input-label="t('tools.quote-converter.texts.input-label-double-quoted-string')"
        :input-placeholder="t('tools.quote-converter.texts.input-placeholder-paste-your-double-quoted-string-here')"
        :output-label="t('tools.quote-converter.texts.output-label-single-quoted-string')"
        :transformer="toSingleQuotes"
      />
    </c-card>
  </div>
</template>
