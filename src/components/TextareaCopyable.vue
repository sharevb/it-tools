<script setup lang="ts">
import { Copy } from '@vicons/tabler';
import { useElementSize } from '@vueuse/core';
import hljs from 'highlight.js/lib/core';
import jsonHljs from 'highlight.js/lib/languages/json';
import sqlHljs from 'highlight.js/lib/languages/sql';
import xmlHljs from 'highlight.js/lib/languages/xml';
import yamlHljs from 'highlight.js/lib/languages/yaml';
import iniHljs from 'highlight.js/lib/languages/ini';
import tsHljs from 'highlight.js/lib/languages/typescript';
import bashHljs from 'highlight.js/lib/languages/bash';
import markdownHljs from 'highlight.js/lib/languages/markdown';
import jsHljs from 'highlight.js/lib/languages/javascript';
import cssHljs from 'highlight.js/lib/languages/css';
import goHljs from 'highlight.js/lib/languages/go';
import pythonHljs from 'highlight.js/lib/languages/python';
import phpHljs from 'highlight.js/lib/languages/php';
import csharpHljs from 'highlight.js/lib/languages/csharp';
import protobufHljs from 'highlight.js/lib/languages/protobuf';
import { Base64 } from 'js-base64';
import { useCopy } from '@/composable/copy';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { translate as t } from '@/plugins/i18n.plugin';

const props = withDefaults(
  defineProps<{
    value: string
    followHeightOf?: HTMLElement | null
    language?: string
    copyPlacement?: 'top-right' | 'bottom-right' | 'outside' | 'none'
    copyMessage?: string
    wordWrap?: boolean
    downloadFileName?: string
    downloadButtonText?: string
    scrollable?: boolean
    maxHeight?: string
  }>(),
  {
    followHeightOf: null,
    language: 'txt',
    copyPlacement: 'top-right',
    copyMessage: t('textareaCopyable.copy'),
    downloadFileName: '',
    downloadButtonText: t('textareaCopyable.download'),
    scrollable: false,
    maxHeight: '400px',
  },
);
hljs.registerLanguage('sql', sqlHljs);
hljs.registerLanguage('json', jsonHljs);
hljs.registerLanguage('html', xmlHljs);
hljs.registerLanguage('xml', xmlHljs);
hljs.registerLanguage('yaml', yamlHljs);
hljs.registerLanguage('toml', iniHljs);
hljs.registerLanguage('ini', iniHljs);
hljs.registerLanguage('ts', tsHljs);
hljs.registerLanguage('typescript', tsHljs);
hljs.registerLanguage('bash', bashHljs);
hljs.registerLanguage('markdown', markdownHljs);
hljs.registerLanguage('css', cssHljs);
hljs.registerLanguage('javascript', jsHljs);
hljs.registerLanguage('go', goHljs);
hljs.registerLanguage('csharp', csharpHljs);
hljs.registerLanguage('python', pythonHljs);
hljs.registerLanguage('php', phpHljs);
hljs.registerLanguage('protobuf', protobufHljs);

const { value, language, followHeightOf, copyPlacement, copyMessage, downloadFileName, downloadButtonText } = toRefs(props);
const { height } = followHeightOf.value ? useElementSize(followHeightOf) : { height: ref(null) };

const scrollbarRef = ref();

// Watch for content changes and scroll to bottom
watch(value, () => {
  nextTick(() => {
    if (scrollbarRef.value) {
      scrollbarRef.value.scrollTo({ top: scrollbarRef.value.scrollbarInstRef.containerRef.scrollHeight });
    }
  });
}, { flush: 'post' });

const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
const tooltipText = computed(() => isJustCopied.value ? t('textareaCopyable.copied') : copyMessage.value);

const valueBase64 = computed(() => Base64.encode(value.value));
const { download } = useDownloadFileFromBase64(
  {
    source: valueBase64,
    filename: downloadFileName,
  });
</script>

<template>
  <div style="overflow-x: hidden; width: 100%">
    <c-card
      relative
      :style="(copyPlacement === 'top-right' || copyPlacement === 'bottom-right') ? `padding-bottom: 50px` : ''"
    >
      <n-scrollbar
        ref="scrollbarRef"
        :x-scrollable="true"
        :y-scrollable="scrollable"
        trigger="none"
        :style="{
          minHeight: height ? `${height - 40 /* card padding */ + 10 /* negative margin compensation */}px` : '',
          maxHeight: scrollable ? maxHeight : '',
        }"
      >
        <n-config-provider :hljs="hljs">
          <n-code :code="value" :language="language" :word-wrap="wordWrap" :trim="false" data-test-id="area-content" />
        </n-config-provider>
      </n-scrollbar>
      <div
        v-if="value && copyPlacement !== 'none'"
        :top-10px="copyPlacement === 'top-right' ? '' : 'no'"
        :bottom-10px="copyPlacement === 'bottom-right' ? '' : 'no'"
        absolute right-10px
        :style="scrollable ? 'z-index: 10; background: var(--bg-color); border-radius: 50%; padding: 2px;' : ''"
      >
        <c-tooltip v-if="value && copyPlacement !== 'outside'" :tooltip="tooltipText" position="left">
          <c-button circle important:h-10 important:w-10 @click="copy()">
            <n-icon size="22" :component="Copy" />
          </c-button>
        </c-tooltip>
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

<style lang="less" scoped>
::v-deep(.n-scrollbar) {
  padding-bottom: 10px;
  margin-bottom: -10px;
}
</style>
