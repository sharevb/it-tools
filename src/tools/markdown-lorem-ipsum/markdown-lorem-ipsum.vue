<script setup lang="ts">
import { type GeneratorConfig, generateMarkdown, getSupportedLanguages } from './markdown-lorem-ipsum.service';

const headerStyleOptions = [
  { label: 'ATX (#, ##, ###)', value: 'atx' },
  { label: 'Setext (====, ----)', value: 'setext' },
];
const listStyleOptions = [
  { label: 'Unordered (-, *, +)', value: 'unordered' },
  { label: 'Ordered (1., 2., 3.)', value: 'ordered' },
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

onMounted(generate);
</script>

<template>
  <div>
    <n-form :model="ui" label-placement="left">
      <n-space justify="center">
        <c-select
          v-model:value="ui.language"
          searchable
          label="Language:"
          label-position="left"
          style="width: 200px"
          :options="Object.values(supportedLanguages)"
          mb-2
        />

        <n-form-item label="Blocks:">
          <n-input-number v-model:value="ui.blocks" :min="1" :max="50" />
        </n-form-item>

        <n-form-item label="Sentences per paragraph:">
          <n-input-number v-model:value="ui.avgSentencePerPara" :min="1" :max="12" />
        </n-form-item>
      </n-space>

      <c-card title="Styles" mb-2>
        <n-space justify="center">
          <n-form-item label="Block types:">
            <n-space wrap>
              <n-checkbox v-model:checked="ui.enableHeaders">
                Headers
              </n-checkbox>
              <n-checkbox v-model:checked="ui.enableLists">
                Lists
              </n-checkbox>
              <n-checkbox v-model:checked="ui.enableCode">
                Code
              </n-checkbox>
              <n-checkbox v-model:checked="ui.enableBlockquotes">
                Quotes
              </n-checkbox>
            </n-space>
          </n-form-item>

          <n-form-item label="Inline styles">
            <n-space wrap>
              <n-checkbox v-model:checked="ui.inlineEmphasis">
                Emphasis
              </n-checkbox>
              <n-checkbox v-model:checked="ui.inlineStrong">
                Strong
              </n-checkbox>
              <n-checkbox v-model:checked="ui.inlineLinks">
                Links
              </n-checkbox>
              <n-checkbox v-model:checked="ui.inlineCode">
                Inline code
              </n-checkbox>
            </n-space>
          </n-form-item>
        </n-space>

        <n-space justify="center">
          <n-form-item label="Header style:">
            <n-select v-model:value="ui.headerStyle" :options="headerStyleOptions" />
          </n-form-item>

          <n-form-item label="List style:">
            <n-select v-model:value="ui.listStyle" :options="listStyleOptions" />
          </n-form-item>
        </n-space>
      </c-card>

      <c-card title="Block frequencies" mb-2>
        <n-space>
          <n-form-item label="Headers:">
            <n-input-number v-model:value="ui.headerFrequency" :step="0.05" :min="0" :max="1" size="small" style="width:180px" />
          </n-form-item>

          <n-form-item label="Lists:">
            <n-input-number v-model:value="ui.listFrequency" :step="0.05" :min="0" :max="1" size="small" style="width:180px" />
          </n-form-item>

          <n-form-item label="Code:">
            <n-input-number v-model:value="ui.codeFrequency" :step="0.05" :min="0" :max="1" size="small" style="width:180px" />
          </n-form-item>

          <n-form-item label="Quotes:">
            <n-input-number v-model:value="ui.quoteFrequency" :step="0.05" :min="0" :max="1" size="small" style="width:180px" />
          </n-form-item>
        </n-space>
      </c-card>

      <n-space justify="center">
        <n-button type="primary" @click="generate">
          Generate
        </n-button>
      </n-space>
    </n-form>

    <c-card title="Generated Markdown" mt-2>
      <textarea-copyable :value="markdown" language="markdown" />
    </c-card>
  </div>
</template>
