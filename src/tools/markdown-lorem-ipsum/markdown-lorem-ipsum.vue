<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import markdownit from 'markdown-it';
import { type GeneratorConfig, generateMarkdown, getSupportedLanguages } from './markdown-lorem-ipsum.service';

const { t } = useI18n();

const headerStyleOptions = [
  { label: t('tools.markdown-lorem-ipsum.texts.label-atx'), value: 'atx' },
  { label: t('tools.markdown-lorem-ipsum.texts.label-setext'), value: 'setext' },
];
const listStyleOptions = [
  { label: t('tools.markdown-lorem-ipsum.texts.label-unordered'), value: 'unordered' },
  { label: t('tools.markdown-lorem-ipsum.texts.label-ordered-1-2-3'), value: 'ordered' },
];

const ui = ref<GeneratorConfig>({
  seedStr: '',
  blocks: 12,
  avgSentencePerPara: 4,
  enableHeaders: true,
  enableLists: true,
  enableCode: true,
  enableBlockquotes: true,
  inlineEmphasis: true,
  inlineStrong: true,
  inlineLinks: true,
  inlineCode: true,
  headerStyle: 'atx',
  listStyle: 'unordered',
  headerFrequency: 0.5,
  listFrequency: 0.05,
  codeFrequency: 0.15,
  quoteFrequency: 0.15,
  language: 'English',
});

const markdown = ref('');

function generate() {
  ui.value.seedStr = `seed-${Math.random().toString(36).slice(2)}`;
  markdown.value = generateMarkdown(ui.value);
}

const supportedLanguages = getSupportedLanguages();

function printLorem() {
  const w = window.open();
  if (w === null) {
    return;
  }
  w.document.body.innerHTML = markdownit().render(markdown.value || '');
  w.print();
}

onMounted(generate);
</script>

<template>
  <div>
    <n-form :model="ui" label-placement="left">
      <n-space justify="center">
        <c-select
          v-model:value="ui.language"
          searchable
          :label="t('tools.markdown-lorem-ipsum.texts.label-language')"
          label-position="left"
          style="width: 200px"
          :options="Object.values(supportedLanguages)"
          mb-2
        />

        <n-form-item :label="t('tools.markdown-lorem-ipsum.texts.label-blocks')">
          <n-input-number v-model:value="ui.blocks" :min="1" :max="50" />
        </n-form-item>

        <n-form-item :label="t('tools.markdown-lorem-ipsum.texts.label-sentences-per-paragraph')">
          <n-input-number v-model:value="ui.avgSentencePerPara" :min="1" :max="12" />
        </n-form-item>
      </n-space>

      <c-card :title="t('tools.markdown-lorem-ipsum.texts.title-styles')" mb-2>
        <n-space justify="center">
          <n-form-item :label="t('tools.markdown-lorem-ipsum.texts.label-block-types')">
            <n-space wrap>
              <n-checkbox v-model:checked="ui.enableHeaders">
                {{ t('tools.markdown-lorem-ipsum.texts.tag-headers') }}
              </n-checkbox>
              <n-checkbox v-model:checked="ui.enableLists">
                {{ t('tools.markdown-lorem-ipsum.texts.tag-lists') }}
              </n-checkbox>
              <n-checkbox v-model:checked="ui.enableCode">
                {{ t('tools.markdown-lorem-ipsum.texts.tag-code') }}
              </n-checkbox>
              <n-checkbox v-model:checked="ui.enableBlockquotes">
                {{ t('tools.markdown-lorem-ipsum.texts.tag-quotes') }}
              </n-checkbox>
            </n-space>
          </n-form-item>

          <n-form-item :label="t('tools.markdown-lorem-ipsum.texts.label-inline-styles')">
            <n-space wrap>
              <n-checkbox v-model:checked="ui.inlineEmphasis">
                {{ t('tools.markdown-lorem-ipsum.texts.tag-emphasis') }}
              </n-checkbox>
              <n-checkbox v-model:checked="ui.inlineStrong">
                {{ t('tools.markdown-lorem-ipsum.texts.tag-strong') }}
              </n-checkbox>
              <n-checkbox v-model:checked="ui.inlineLinks">
                {{ t('tools.markdown-lorem-ipsum.texts.tag-links') }}
              </n-checkbox>
              <n-checkbox v-model:checked="ui.inlineCode">
                {{ t('tools.markdown-lorem-ipsum.texts.tag-inline-code') }}
              </n-checkbox>
            </n-space>
          </n-form-item>
        </n-space>

        <n-space justify="center">
          <n-form-item :label="t('tools.markdown-lorem-ipsum.texts.label-header-style')">
            <n-select v-model:value="ui.headerStyle" :options="headerStyleOptions" />
          </n-form-item>

          <n-form-item :label="t('tools.markdown-lorem-ipsum.texts.label-list-style')">
            <n-select v-model:value="ui.listStyle" :options="listStyleOptions" />
          </n-form-item>
        </n-space>
      </c-card>

      <c-card :title="t('tools.markdown-lorem-ipsum.texts.title-block-frequencies')" mb-2>
        <n-space>
          <n-form-item :label="t('tools.markdown-lorem-ipsum.texts.label-headers')">
            <n-input-number v-model:value="ui.headerFrequency" :step="0.05" :min="0" :max="1" size="small" style="width:180px" />
          </n-form-item>

          <n-form-item :label="t('tools.markdown-lorem-ipsum.texts.label-lists')">
            <n-input-number v-model:value="ui.listFrequency" :step="0.05" :min="0" :max="1" size="small" style="width:180px" />
          </n-form-item>

          <n-form-item :label="t('tools.markdown-lorem-ipsum.texts.label-code')">
            <n-input-number v-model:value="ui.codeFrequency" :step="0.05" :min="0" :max="1" size="small" style="width:180px" />
          </n-form-item>

          <n-form-item :label="t('tools.markdown-lorem-ipsum.texts.label-quotes')">
            <n-input-number v-model:value="ui.quoteFrequency" :step="0.05" :min="0" :max="1" size="small" style="width:180px" />
          </n-form-item>
        </n-space>
      </c-card>

      <n-space justify="center">
        <n-button type="primary" @click="generate">
          {{ t('tools.markdown-lorem-ipsum.texts.tag-generate') }}
        </n-button>
      </n-space>
    </n-form>

    <c-card :title="t('tools.markdown-lorem-ipsum.texts.title-generated-markdown')" mt-2>
      <textarea-copyable :value="markdown" language="markdown" download-file-name="lorem.md" />
      <n-space justify="center" mt-2>
        <c-button @click="printLorem">
          {{ t('tools.markdown-lorem-ipsum.texts.tag-print-ie-use-a-pdf-printer-to-get-a-pdf-file') }}
        </c-button>
      </n-space>
    </c-card>
  </div>
</template>
