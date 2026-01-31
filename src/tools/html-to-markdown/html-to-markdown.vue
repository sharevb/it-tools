<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import TurndownService from 'turndown';
import { gfm as addGFM } from '@guyplusplus/turndown-plugin-gfm';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const headingsStyle = useQueryParamOrStorage<string>({ name: 'headings', storageName: 'html-to-md:hs', defaultValue: 'hash' });
const emphasisStyle = useQueryParamOrStorage<string>({ name: 'emphasis', storageName: 'html-to-md:em', defaultValue: 'standard' });

const turndownService = new TurndownService();

function escapeMarkdown(text: string) {
  return text
    .replace(/\\/g, '\\\\') // escape backslash first
    .replace(/([*_#>|`])/g, '\\$1') // escape common markdown symbols
    .replace(/([\[\]\(\)])/g, '\\$1') // escape brackets and parentheses
    .replace(/\|/g, '\\|'); // escape table pipes
}

turndownService.addRule('escapeText', {
  filter(node) {
    return node.nodeType === 3; // text nodes
  },
  replacement(content) {
    return escapeMarkdown(content);
  },
});

addGFM(turndownService);

turndownService.addRule('normalizedHeading', {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  replacement(content, node) {
    const level = Number.parseInt(node.nodeName.charAt(1));

    // Normalize spacing
    const text = content.trim().replace(/\s+/g, ' ');

    // Choose style based on user preference
    if (headingsStyle.value === 'underline') {
      if (level === 1) {
        return `\n${text}\n${'='.repeat(text.length)}\n\n`;
      }
      if (level === 2) {
        return `\n${text}\n${'-'.repeat(text.length)}\n\n`;
      }
    }
    else if (headingsStyle.value === 'surround') {
      return `\n${'='.repeat(level)} ${text} ${'='.repeat(level)}\n\n`;
    }

    // Default hash style
    return `\n${'#'.repeat(level)} ${text}\n\n`;
  },
});
// Italic rule
turndownService.addRule('customItalic', {
  filter: ['em', 'i'],
  replacement(content) {
    if (emphasisStyle.value === 'underscore') {
      return `_${content}_`;
    }
    if (emphasisStyle.value === 'surround') {
      return `~${content}~`;
    }
    return `*${content}*`;
  },
});

// Bold rule
turndownService.addRule('customBold', {
  filter: ['strong', 'b'],
  replacement(content) {
    if (emphasisStyle.value === 'underscore') {
      return `__${content}__`;
    }
    if (emphasisStyle.value === 'surround') {
      return `~~${content}~~`;
    }
    return `**${content}**`;
  },
});

const inputHtml = ref('');
const outputMarkdown = computed(() => {
  try {
    return turndownService.turndown(inputHtml.value ?? '');
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <n-space justify="center" mb-3>
      <c-select
        v-model:value="headingsStyle"
        :label="t('tools.html-to-markdown.texts.label-heading-style')"
        label-position="left"
        style="width: 300px"
        :options="[
          { value: 'hash', label: t('tools.html-to-markdown.texts.label-hash') },
          { value: 'underline', label: t('tools.html-to-markdown.texts.label-underline') },
          { value: 'surround', label: t('tools.html-to-markdown.texts.label-surround-heading') },
        ]"
      />
      <c-select
        v-model:value="emphasisStyle"
        :label="t('tools.html-to-markdown.texts.label-emphasis-style')"
        label-position="left"
        style="width: 300px"
        :options="[
          { value: 'standard', label: t('tools.html-to-markdown.texts.label-asterisk') },
          { value: 'underscore', label: t('tools.html-to-markdown.texts.label-underscore') },
          { value: 'surround', label: t('tools.html-to-markdown.texts.label-tilde') },
        ]"
      />
    </n-space>

    <c-input-text
      v-model:value="inputHtml"
      multiline raw-text
      :placeholder="t('tools.html-to-markdown.texts.placeholder-your-html-content')"
      rows="8"
      autofocus
      :label="t('tools.html-to-markdown.texts.label-your-html-to-convert-can-paste-from-clipboard')"
      paste-html
    />

    <n-divider />

    <n-form-item :label="t('tools.html-to-markdown.texts.label-output-markdown')">
      <TextareaCopyable :value="outputMarkdown" download-file-name="output.md" />
    </n-form-item>
  </div>
</template>
