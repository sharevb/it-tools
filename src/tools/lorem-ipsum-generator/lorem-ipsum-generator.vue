<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import markdownit from 'markdown-it';
import { generateLoremIpsum, getSupportedLanguages } from './lorem-ipsum-generator.service';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { randIntFromInterval } from '@/utils/random';

const { t } = useI18n();

const paragraphs = useQueryParamOrStorage({ name: 'paragraphs', storageName: 'lorem:paragraphs', defaultValue: 1 });
const sentences = useQueryParamOrStorage({ name: 'sentences', storageName: 'lorem:sentences', defaultValue: [3, 8] });
const words = useQueryParamOrStorage({ name: 'words', storageName: 'lorem:words', defaultValue: [8, 15] });
const startWithLoremIpsum = ref(true);
const asHTML = useQueryParamOrStorage({ name: 'html', storageName: 'lorem:html', defaultValue: false });
const language = useQueryParamOrStorage({ defaultValue: 'English', storageName: 'lorem:lang', name: 'lang' });

const supportedLanguages = getSupportedLanguages();
const [loremIpsumText, refreshLoremIpsum] = computedRefreshable(() =>
  generateLoremIpsum({
    paragraphCount: paragraphs.value,
    asHTML: asHTML.value,
    sentencePerParagraph: randIntFromInterval(sentences.value[0], sentences.value[1]),
    wordCount: randIntFromInterval(words.value[0], words.value[1]),
    startWithLoremIpsum: startWithLoremIpsum.value,
    language: language.value,
  }),
);

const { copy } = useCopy({ source: loremIpsumText, text: t('tools.lorem-ipsum-generator.texts.text-lorem-ipsum-copied-to-the-clipboard') });

function printLorem() {
  const w = window.open();
  if (w === null) {
    return;
  }
  w.document.body.innerHTML = markdownit().render(loremIpsumText.value || '');
  w.print();
}
</script>

<template>
  <c-card>
    <c-select
      v-model:value="language"
      searchable
      :label="t('tools.lorem-ipsum-generator.texts.label-language')"
      :options="Object.values(supportedLanguages)"
      mb-2
    />
    <n-form-item :label="t('tools.lorem-ipsum-generator.texts.label-paragraphs')" :show-feedback="false" label-width="200" label-placement="left">
      <n-slider v-model:value="paragraphs" :step="1" :min="1" :max="20" />
    </n-form-item>
    <n-form-item :label="t('tools.lorem-ipsum-generator.texts.label-sentences-per-paragraph')" :show-feedback="false" label-width="200" label-placement="left">
      <n-slider v-model:value="sentences" range :step="1" :min="1" :max="50" />
    </n-form-item>
    <n-form-item :label="t('tools.lorem-ipsum-generator.texts.label-words-per-sentence')" :show-feedback="false" label-width="200" label-placement="left">
      <n-slider v-model:value="words" range :step="1" :min="1" :max="50" />
    </n-form-item>
    <n-form-item :label="t('tools.lorem-ipsum-generator.texts.label-start-with-lorem-ipsum')" :show-feedback="false" label-width="200" label-placement="left">
      <n-switch v-model:value="startWithLoremIpsum" />
    </n-form-item>
    <n-form-item :label="t('tools.lorem-ipsum-generator.texts.label-as-html')" :show-feedback="false" label-width="200" label-placement="left">
      <n-switch v-model:value="asHTML" />
    </n-form-item>

    <c-input-text :value="loremIpsumText" multiline :placeholder="t('tools.lorem-ipsum-generator.texts.placeholder-your-lorem-ipsum')" readonly mt-5 rows="5" />

    <div mt-5 flex justify-center gap-3>
      <c-button autofocus @click="copy()">
        {{ t('tools.lorem-ipsum-generator.texts.tag-copy') }}
      </c-button>
      <c-button @click="refreshLoremIpsum">
        {{ t('tools.lorem-ipsum-generator.texts.tag-refresh') }}
      </c-button>
      <c-button @click="printLorem">
        {{ t('tools.lorem-ipsum-generator.texts.tag-print-ie-use-a-pdf-printer-to-get-a-pdf-file') }}
      </c-button>
    </div>
  </c-card>
</template>
