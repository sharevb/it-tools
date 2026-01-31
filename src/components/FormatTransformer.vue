<script setup lang="ts">
import _ from 'lodash';
import { Base64 } from 'js-base64';
import type { UseValidationRule } from '@/composable/validation';
import CInputText from '@/ui/c-input-text/c-input-text.vue';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { translate as t } from '@/plugins/i18n.plugin';
import { useAppTheme } from '@/ui/theme/themes';

const props = withDefaults(
  defineProps<{
    transformer?: (v: string) => string
    inputValidationRules?: UseValidationRule<string>[]
    inputLabel?: string
    inputPlaceholder?: string
    inputDefault?: string
    outputLabel?: string
    outputLanguage?: string
    downloadFileName?: string
    downloadButtonText?: string
    rows?: number
    inputLineNumbers?: boolean
    inputMaxRows?: number
    inputAutosize?: boolean
  }>(),
  {
    transformer: _.identity,
    inputValidationRules: () => [],
    inputLabel: t('formatTransformer.input'),
    inputDefault: '',
    inputPlaceholder: t('formatTransformer.input-placeholder'),
    outputLabel: t('formatTransformer.output'),
    outputLanguage: '',
    downloadFileName: '',
    downloadButtonText: t('formatTransformer.download'),
    rows: 15,
    inputLineNumbers: false,
    inputMaxRows: undefined,
    inputAutosize: true,
  },
);

const {
  transformer, inputValidationRules, inputLabel, outputLabel, outputLanguage,
  inputPlaceholder, inputDefault, downloadFileName, downloadButtonText, rows, inputLineNumbers, inputMaxRows, inputAutosize,
} = toRefs(props);

const appTheme = useAppTheme();

const inputElement = ref<typeof CInputText>();
const textareaElement = computed(() => {
  const textarea = inputElement.value?.textareaRef;
  if (!textarea) {
    return null;
  }

  if (typeof textarea === 'object' && 'addEventListener' in textarea && 'scrollTop' in textarea) {
    return textarea as HTMLTextAreaElement;
  }

  if (typeof textarea === 'object' && 'value' in textarea) {
    const element = (textarea as { value?: unknown }).value;
    if (element && typeof element === 'object' && 'addEventListener' in element && 'scrollTop' in element) {
      return element as HTMLTextAreaElement;
    }
  }

  return null;
});

const input = ref(inputDefault.value);
const output = computed(() => transformer.value(input.value));

const lineCount = computed(() => {
  if (input.value === '') {
    return 1;
  }

  return input.value.split(/\r\n|\r|\n/).length;
});

const lineNumbersText = computed(() => {
  if (!inputLineNumbers.value) {
    return '';
  }

  return Array.from({ length: lineCount.value }, (_, index) => index + 1).join('\n');
});

const lineNumberGutterWidth = computed(() => Math.max(1, `${lineCount.value}`.length));
const lineNumbersOffset = ref(0);
const lineNumbersHeight = ref(0);
const lineNumbersPaddingTop = ref('');
const lineNumbersPaddingBottom = ref('');
const lineNumbersLineHeight = ref('');
const lineNumbersFontSize = ref('');

watch(
  () => ({
    textarea: textareaElement.value,
    enabled: inputLineNumbers.value,
  }),
  ({ textarea, enabled }, _, onCleanup) => {
    if (!enabled || !textarea) {
      lineNumbersOffset.value = 0;
      lineNumbersHeight.value = 0;
      lineNumbersPaddingTop.value = '';
      lineNumbersPaddingBottom.value = '';
      lineNumbersLineHeight.value = '';
      lineNumbersFontSize.value = '';
      return;
    }

    const updateSize = () => {
      lineNumbersHeight.value = textarea.clientHeight;
      lineNumbersOffset.value = textarea.scrollTop;
      const computedStyle = window.getComputedStyle(textarea);
      lineNumbersPaddingTop.value = computedStyle.paddingTop;
      lineNumbersPaddingBottom.value = computedStyle.paddingBottom;
      lineNumbersLineHeight.value = computedStyle.lineHeight;
      lineNumbersFontSize.value = computedStyle.fontSize;
    };

    const handleScroll = () => {
      lineNumbersOffset.value = textarea.scrollTop;
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(textarea);
    textarea.addEventListener('scroll', handleScroll);

    onCleanup(() => {
      textarea.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    });
  },
  { immediate: true },
);

watch(
  input,
  () => nextTick(() => {
    const textarea = textareaElement.value;
    if (textarea) {
      lineNumbersOffset.value = textarea.scrollTop;
    }
  }),
  { flush: 'post' },
);

function focusInput() {
  inputElement.value?.focus?.();
}

const outputBase64 = computed(() => Base64.encode(output.value));
const { download } = useDownloadFileFromBase64(
  {
    source: outputBase64,
    filename: downloadFileName,
  });
</script>

<template>
  <CInputText
    ref="inputElement"
    v-model:value="input"
    :placeholder="inputPlaceholder"
    :label="inputLabel"
    :rows="rows"
    :max-rows="inputMaxRows"
    :autosize="inputAutosize"
    raw-text
    multiline
    test-id="input"
    :validation-rules="inputValidationRules"
    monospace
    mb-1
  >
    <template v-if="inputLineNumbers" #prefix>
      <div
        class="line-numbers font-mono"
        :style="{
          minWidth: `${lineNumberGutterWidth}ch`,
          height: lineNumbersHeight ? `${lineNumbersHeight}px` : '',
          paddingTop: lineNumbersPaddingTop,
          paddingBottom: lineNumbersPaddingBottom,
          lineHeight: lineNumbersLineHeight,
          fontSize: lineNumbersFontSize,
        }"
        aria-hidden="true"
        @click="focusInput"
      >
        <pre class="line-numbers__content" :style="{ transform: `translateY(-${lineNumbersOffset}px)` }">{{ lineNumbersText }}</pre>
      </div>
    </template>
  </CInputText>

  <div overflow-auto>
    <div mb-5px>
      {{ outputLabel }}
    </div>
    <textarea-copyable :value="output" :language="outputLanguage" :follow-height-of="inputElement?.inputWrapperRef" />

    <div v-if="downloadFileName !== '' && output !== ''" mt-5 flex justify-center>
      <c-button secondary @click="download">
        {{ downloadButtonText }}
      </c-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.line-numbers {
  align-self: stretch;
  flex: 0 0 auto;
  box-sizing: border-box;
  padding: 8px 8px 8px 0;
  margin-right: 8px;
  border-right: 1px solid v-bind('appTheme.default.color');
  color: v-bind('appTheme.text.mutedColor');
  overflow: hidden;
  user-select: none;
  text-align: right;
}

.line-numbers__content {
  margin: 0;
  white-space: pre;
  line-height: inherit;
  font-size: inherit;
  will-change: transform;
}
</style>
