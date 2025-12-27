<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { bundledLanguagesInfo, createHighlighter } from 'shiki/bundle/full';
import { bundledThemesInfo } from 'shiki/themes';
import { useMessage } from 'naive-ui';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();

const code = ref(`// Using 'typeof' to infer types
const person = { name: "Alice", age: 30 };
type PersonType = typeof person;  // { name: string; age: number }

// 'satisfies' to ensure a type matches but allows more specific types
type Animal = { name: string };
const dog = { name: "Buddy", breed: "Golden Retriever" } satisfies Animal;

// Generics with 'extends' and default values
function identity<T extends number | string = string>(arg: T): T {
  return arg;
}`);

const themes = ref<{ value: string; label: string }[]>(
  bundledThemesInfo.map((item) => {
    return {
      value: item.id,
      label: item.displayName,
    };
  }));
const langs = ref<{ value: string; label: string }[]>(
  bundledLanguagesInfo.map(item => ({
    value: item.id,
    label: item.name,
  })));

const currentTheme = useQueryParamOrStorage({ name: 'theme', storageName: 'code-highlighter:theme', defaultValue: 'dark-plus' });
const currentLang = useQueryParamOrStorage({ name: 'lang', storageName: 'code-highlighter:lang', defaultValue: 'typescript' });

const showLineNumbers = ref(false);
const transparentBackground = ref(false);

const formattedCodeHtml = computedAsync(async () => {
  const currentThemeValue = currentTheme.value;
  const currentLangValue = currentLang.value;
  const codeValue = code.value;
  const needLineNumbers = showLineNumbers.value;

  const lineNumberWidth = Math.log10(codeValue.split('\n').length) + 2;

  const highlighter = await createHighlighter(
    {
      langs: [currentLangValue],
      themes: [currentThemeValue],
    });
  return highlighter.codeToHtml(codeValue, {
    lang: currentLangValue,
    theme: currentThemeValue,
    transformers: [
      {
        postprocess(html: string) {
          // when copied to clipboard and pasted to LibreOffice,
          // formatting of first line is only kept if there is a line break before...
          const ensureFirstLineFormattedWhenCopied
              = (html: string) => html.replace('<code>', '<code>\n');
          if (!needLineNumbers) {
            return ensureFirstLineFormattedWhenCopied(html);
          }
          let lineNumber = 1;
          return html.replace(/<span class="line/g, (m) => {
            const lineNumberFormatted = (lineNumber++).toString().padStart(lineNumberWidth, ' ');
            return `<span class="line-number" style="white-space-collapse: preserve">${lineNumberFormatted}  </span>${m}`;
          }).replace('<code>', '<code>\n');
        },
      },
    ],
  });
});
const { copy: copyText } = useCopy({ source: code });

// Transform HTML to be Outlook-compatible (Outlook ignores styles on pre/code tags)
function makeOutlookCompatible(html: string, useTransparentBg: boolean): string {
  return html
    // Replace <pre> with a styled <div> (Outlook handles divs better)
    .replace(/<pre[^>]*style="([^"]*)"[^>]*>/g, (_, style) => {
      // Remove background-color if transparent is requested
      const finalStyle = useTransparentBg
        ? style.replace(/background-color:\s*[^;]+;?/g, '')
        : style;
      return `<div style="${finalStyle}; font-family: Consolas, Monaco, 'Courier New', monospace; padding: 16px; border-radius: 4px;">`;
    })
    .replace(/<\/pre>/g, '</div>')
    // Replace <code> with <div>
    .replace(/<code>/g, '<div>')
    .replace(/<\/code>/g, '</div>')
    // Replace line spans with divs and add explicit background
    .replace(/<span class="line">/g, '<div style="font-family: Consolas, Monaco, \'Courier New\', monospace; white-space: pre;">')
    .replace(/<span class="line([^"]*)"/g, '<div style="font-family: Consolas, Monaco, \'Courier New\', monospace; white-space: pre;" class="line$1"')
    // Close line divs properly (lines end with </span> for the line wrapper)
    .replace(/(<div style="font-family: Consolas[^"]*"[^>]*>.*?)(<\/span>)(\s*<div style="font-family: Consolas|$)/g, '$1</div>$3')
    // Add monospace font to all colored spans
    .replace(/<span style="color:/g, '<span style="font-family: Consolas, Monaco, \'Courier New\', monospace; color:');
}

// Copy with both MIME types: text/html for Word/Outlook, text/plain for code editors
const message = useMessage();
async function copyHtml() {
  if (!formattedCodeHtml.value) {
    return;
  }

  const outlookHtml = makeOutlookCompatible(formattedCodeHtml.value, transparentBackground.value);

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([outlookHtml], { type: 'text/html' }),
        'text/plain': new Blob([formattedCodeHtml.value], { type: 'text/plain' }),
      }),
    ]);
    message.success(t('tools.code-highlighter.texts.tag-copy-html-formatted'));
  }
  catch (err) {
    console.error('Clipboard error:', err);
    message.error('Failed to copy to clipboard');
  }
}
</script>

<template>
  <div>
    <div mb-3 flex items-baseline gap-1>
      <c-select
        v-model:value="currentLang"
        :label="t('tools.code-highlighter.texts.label-language')"
        label-position="left"
        searchable
        :options="langs"
        flex-1
      />
      <c-select
        v-model:value="currentTheme"
        :label="t('tools.code-highlighter.texts.label-theme')"
        label-position="left"
        searchable
        :options="themes"
        flex-1
      />
    </div>

    <c-input-text
      v-model:value="code"
      :label="t('tools.code-highlighter.texts.label-code-snippet-to-format')"
      multiline
      :placeholder="t('tools.code-highlighter.texts.placeholder-put-your-code-snippet-here')"
      rows="5"
      mb-3
    />

    <div flex flex-wrap justify-center gap-2>
      <n-form-item :label="t('tools.code-highlighter.texts.label-show-line-numbers')" label-placement="left">
        <n-switch v-model:value="showLineNumbers" />
      </n-form-item>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-form-item label="Transparent background" label-placement="left">
            <n-switch v-model:value="transparentBackground" />
          </n-form-item>
        </template>
        Removes the background color for better readability when pasting into Outlook or other email clients
      </n-tooltip>
      <c-button @click="copyHtml()">
        {{ t('tools.code-highlighter.texts.tag-copy-html-formatted') }}
      </c-button>
      <c-button @click="copyText()">
        {{ t('tools.code-highlighter.texts.tag-copy-code-text') }}
      </c-button>
    </div>

    <div v-html="formattedCodeHtml" /><!-- //NOSONAR -->
  </div>
</template>

<style scoped>
::v-deep(.line-number) {
  text-wrap: nowrap;
}
</style>
