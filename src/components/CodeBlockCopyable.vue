<script setup lang="ts">
import Copy from '~icons/tabler/copy';
import { Base64 } from 'js-base64';
import { useCopy } from '@/composable/copy';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { translate as t } from '@/plugins/i18n.plugin';

import { EditorView, basicSetup } from 'codemirror';
import { Compartment, EditorState } from '@codemirror/state';

import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';
import { css } from '@codemirror/lang-css';
import { markdown } from '@codemirror/lang-markdown';
import { sql } from '@codemirror/lang-sql';
import { yaml } from '@codemirror/lang-yaml';
import { go } from '@codemirror/lang-go';
import { python } from '@codemirror/lang-python';
import { php } from '@codemirror/lang-php';
import { cpp } from '@codemirror/lang-cpp';

import { oneDark } from '@codemirror/theme-one-dark';
import { keymap, lineNumbers } from '@codemirror/view';
import { foldGutter, foldKeymap } from '@codemirror/language';
import { useStyleStore } from '@/stores/style.store';

const props = withDefaults(
  defineProps<{
    value: string;
    language?: string;
    copyPlacement?: 'top-right' | 'bottom-right' | 'outside' | 'none';
    copyMessage?: string;
    downloadFileName?: string;
    downloadButtonText?: string;
    maxHeight?: string;
    showLineNumbers?: boolean;
    showFoldGutter?: boolean;
  }>(),
  {
    language: 'txt',
    copyPlacement: 'top-right',
    copyMessage: t('textareaCopyable.copy'),
    downloadFileName: '',
    downloadButtonText: t('textareaCopyable.download'),
    maxHeight: '400px',
  },
);

const {
  value,
  maxHeight,
  language,
  showLineNumbers,
  showFoldGutter,
  copyPlacement,
  copyMessage,
  downloadFileName,
  downloadButtonText,
} = toRefs(props);

const styleStore = useStyleStore();
const isDarkTheme = computed(() => styleStore.isDarkTheme);

const editorRoot = ref<HTMLElement | null>(null);
let view: EditorView | null = null;

// Compartments for dynamic reconfiguration
const themeCompartment = new Compartment();
const languageCompartment = new Compartment();

const maxHeightStyle = computed(() =>
  maxHeight.value ? (typeof maxHeight.value === 'number' ? `${maxHeight.value}px` : maxHeight.value) : '400px',
);

// ---------------------------
// LANGUAGE REGISTRY
// ---------------------------
function resolveLanguage(lang: string) {
  const l = lang.toLowerCase();

  switch (l) {
    case 'sql':
      return sql();

    case 'json':
      return json();

    case 'html':
      return html();

    case 'xml':
      return xml();

    case 'yaml':
      return yaml();

    case 'ts':
    case 'typescript':
      return javascript({ typescript: true });

    case 'markdown':
    case 'md':
      return markdown();

    case 'css':
      return css();

    case 'javascript':
    case 'js':
      return javascript();

    case 'go':
      return go();

    case 'csharp':
    case 'cs':
      return cpp(); // closest CM6 grammar

    case 'python':
    case 'py':
      return python();

    case 'php':
      return php();

    default:
      return []; // plain text fallback
  }
}

function themeExtension() {
  return isDarkTheme.value ? oneDark : [];
}

// ---------------------------
// EDITOR INITIALIZATION
// ---------------------------
function createExtensions() {
  return [
    basicSetup,
    EditorView.editable.of(false),
    EditorState.readOnly.of(true),
    EditorView.lineWrapping,
    keymap.of(foldKeymap),
    themeCompartment.of(themeExtension()),
    languageCompartment.of(resolveLanguage(language.value ?? 'plain')),
    (showLineNumbers.value ?? true) ? lineNumbers() : [],
    (showFoldGutter.value ?? true) ? foldGutter({ openText: '▾', closedText: '▸' }) : [],
  ];
}

function initEditor() {
  if (!editorRoot.value) {
    return;
  }

  view = new EditorView({
    doc: value.value,
    extensions: createExtensions(),
    parent: editorRoot.value,
  });
}

function destroyEditor() {
  if (view) {
    view.destroy();
    view = null;
  }
}

onMounted(() => {
  initEditor();
});

onBeforeUnmount(destroyEditor);

watch(isDarkTheme, () => {
  if (view) {
    view.dispatch({
      effects: themeCompartment.reconfigure(themeExtension()),
    });
  }
});

watch(
  () => props.language,
  () => {
    if (view) {
      view.dispatch({
        effects: languageCompartment.reconfigure(resolveLanguage(props.language ?? 'plain')),
      });
    }
  },
);

watch(
  () => props.value,
  (newVal) => {
    if (!view) {
      return;
    }
    const current = view.state.doc.toString();
    if (newVal !== current) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: newVal,
        },
      });
    }
  },
);

const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
const tooltipText = computed(() => (isJustCopied.value ? t('textareaCopyable.copied') : copyMessage.value));

const valueBase64 = computed(() => Base64.encode(value.value));
const { download } = useDownloadFileFromBase64({
  source: valueBase64,
  filename: downloadFileName,
});
</script>

<template>
  <div style="overflow-x: hidden; width: 100%">
    <c-card
      relative
      :style="
        copyPlacement === 'top-right'
          ? 'padding-top: 50px'
          : copyPlacement === 'bottom-right'
            ? 'padding-bottom: 50px'
            : ''
      "
    >
      <div
        v-if="value && copyPlacement !== 'none'"
        absolute
        right-10px
        :class="copyPlacement === 'top-right' ? 'top-10px' : copyPlacement === 'bottom-right' ? 'bottom-10px' : ''"
        style="z-index: 10; background: var(--bg-color); border-radius: 50%; padding: 2px"
      >
        <c-tooltip v-if="value && copyPlacement !== 'outside'" :tooltip="tooltipText" position="left">
          <c-button circle important:h-10 important:w-10 @click="copy()">
            <n-icon size="22" :component="Copy" />
          </c-button>
        </c-tooltip>
      </div>
      <div class="code-block">
        <div class="code-block__editor-wrapper" :style="{ maxHeight: maxHeightStyle }">
          <div ref="editorRoot" class="code-block__editor" />
        </div>
      </div>
    </c-card>
    <div v-if="copyPlacement === 'outside'" mt-4 flex justify-center>
      <c-button @click="copy()">
        {{ tooltipText }}
      </c-button>
    </div>
    <div v-if="downloadFileName !== '' && value !== ''" mt-5 flex justify-center>
      <c-button secondary @click="download">
        {{ downloadButtonText }}
      </c-button>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #2d2d2d;
  font-size: 13px;
}

.code-block__toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 4px 8px;
  background: #111;
  border-bottom: 1px solid #2d2d2d;
}

.code-block__copy {
  cursor: pointer;
  border: none;
  background: #2d2d2d;
  color: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.code-block__editor-wrapper {
  overflow: auto;
}

.code-block__editor .cm-editor {
  height: auto;
  min-height: 100%;
}
</style>
