<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import dwGen from 'diceware-generator';
import enWL from 'diceware-wordlist-en';
import enEffWL from 'diceware-wordlist-en-eff';
import jpWL from 'diceware-wordlist-jp';
import spWL from 'diceware-wordlist-sp';
import ruWL from 'diceware-wordlist-ru';
import sweWL from 'diceware-wordlist-swe';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();

const count = useQueryParamOrStorage({ name: 'count', storageName: 'diceware-generator:count', defaultValue: 1 });
const words = useQueryParamOrStorage({ name: 'words', storageName: 'diceware-generator:words', defaultValue: 5 });
const lang = useQueryParamOrStorage({ name: 'lang', storageName: 'diceware-generator:lang', defaultValue: 'en' });

const langs = [
  { value: 'en', label: t('tools.diceware-generator.texts.label-english') },
  { value: 'en-eff', label: t('tools.diceware-generator.texts.label-english-eff') },
  { value: 'sp', label: t('tools.diceware-generator.texts.label-spanish') },
  { value: 'jp', label: t('tools.diceware-generator.texts.label-japanese') },
  { value: 'swe', label: t('tools.diceware-generator.texts.label-swedish') },
  { value: 'ru', label: t('tools.diceware-generator.texts.label-russian') },
];

const [dicewares, refreshDicewares] = computedRefreshable(
  () => Array.from({ length: count.value },
    () => {
      let language = enWL;
      switch (lang.value) {
        case 'en-eff':
          language = enEffWL;
          break;
        case 'sp':
          language = spWL;
          break;
        case 'jp':
          language = jpWL;
          break;
        case 'swe':
          language = sweWL;
          break;
        case 'ru':
          language = ruWL;
          break;
      }
      return dwGen({
        language,
        wordcount: words.value,
        format: 'string',
      });
    }).join('\n'),
);

const { copy } = useCopy({ source: dicewares, text: t('tools.diceware-generator.texts.text-diceward-passwords-copied-to-clipboard') });
</script>

<template>
  <div style="min-height: 80vh">
    <c-card>
      <n-space>
        <n-form-item :label="`Words (${words})`" label-placement="left">
          <n-slider v-model:value="words" :step="1" :min="1" :max="512" mr-2 />
          <n-input-number-i18n v-model:value="words" size="small" />
        </n-form-item>

        <n-form-item :label="t('tools.diceware-generator.texts.label-number-of-diceware-passwords-to-generate')" label-placement="left">
          <n-input-number-i18n v-model:value="count" size="small" />
        </n-form-item>
      </n-space>

      <c-select
        v-model:value="lang"
        :label="t('tools.diceware-generator.texts.label-languages')"
        label-position="left"
        :options="langs"
        mb-4
      />

      <c-input-text
        v-model:value="dicewares"
        :label="t('tools.diceware-generator.texts.label-generated-passwords')"
        multiline
        :placeholder="t('tools.diceware-generator.texts.placeholder-diceware-passwords')"
        readonly
        rows="3"
        autosize
        class="diceware-display"
        word-wrap
      />

      <div mt-5 flex justify-center gap-3>
        <c-button @click="copy()">
          {{ t('tools.diceware-generator.texts.tag-copy') }}
        </c-button>
        <c-button @click="refreshDicewares">
          {{ t('tools.diceware-generator.texts.tag-refresh') }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style scoped lang="less">
::v-deep(.diceware-display) {
  textarea {
    text-align: center;
  }
}
</style>
