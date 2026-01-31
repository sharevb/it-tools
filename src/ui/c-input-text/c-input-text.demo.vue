<script lang="ts" setup>
import { useValidation } from '@/composable/validation';
import CInputText from '@/ui/c-input-text/c-input-text.vue';
import { useAppTheme } from '@/ui/theme/themes';

const value = ref('value');
const valueLong = ref(
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, est modi iusto repellendus fuga accusantium atque at magnam aliquam eum explicabo vero quia, nobis quasi quis! Earum amet quam a?',
);
const lineNumbersValue = ref('Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6');

const appTheme = useAppTheme();
const lineNumberInput = ref<typeof CInputText>();
const lineNumbersOffset = ref(0);
const lineNumbersHeight = ref(0);
const lineNumbersPaddingTop = ref('');
const lineNumbersPaddingBottom = ref('');
const lineNumbersLineHeight = ref('');
const lineNumbersFontSize = ref('');

const lineCount = computed(() => {
  if (lineNumbersValue.value === '') {
    return 1;
  }

  return lineNumbersValue.value.split(/\r\n|\r|\n/).length;
});

const lineNumbersText = computed(() =>
  Array.from({ length: lineCount.value }, (_, index) => index + 1).join('\n'));
const lineNumberGutterWidth = computed(() => Math.max(1, `${lineCount.value}`.length));
const textareaElement = computed(() => {
  const textarea = lineNumberInput.value?.textareaRef;
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

const validationRules = [{ message: 'Length must be > 10', validator: (value: string) => value.length > 10 }];

const validation = useValidation({
  source: value,
  rules: validationRules,
});

watch(
  textareaElement,
  (textarea, _, onCleanup) => {
    if (!textarea) {
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
  lineNumbersValue,
  () => nextTick(() => {
    const textarea = textareaElement.value;
    if (textarea) {
      lineNumbersOffset.value = textarea.scrollTop;
    }
  }),
  { flush: 'post' },
);

function focusLineNumbersInput() {
  lineNumberInput.value?.focus?.();
}
</script>

<template>
  <h2>Default</h2>

  <CInputText value="qsd" />
  <CInputText
    value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, est modi iusto repellendus fuga accusantium atque at magnam aliquam eum explicabo vero quia, nobis quasi quis! Earum amet quam a?"
  />

  <h2>With placeholder</h2>

  <CInputText placeholder="Placeholder" />

  <h2>With label</h2>

  <CInputText label="Label" mb-2 />
  <CInputText label="Label" mb-2 label-position="left" />
  <CInputText label="Label" mb-2 label-position="left" label-width="100px" />
  <CInputText label="Label" mb-2 label-position="left" label-width="100px" label-align="right" />

  <h2>Readonly</h2>

  <CInputText value="value" readonly />

  <h2>Disabled</h2>

  <CInputText value="value" disabled />

  <h2>Validation</h2>

  <CInputText v-model:value="value" :validation-rules="validationRules" mb-2 />
  <CInputText v-model:value="value" :validation-rules="validationRules" mb-2 label-position="left" label="Yo " />
  <CInputText v-model:value="value" :validation="validation" />
  <CInputText v-model:value="value" :validation="validation" multiline rows="3" />

  <h2>Clearable</h2>

  <CInputText v-model:value="value" clearable />

  <h2>Type password</h2>

  <CInputText value="value" type="password" />

  <h2>Multiline</h2>

  <CInputText value="value" multiline label="Label" mb-2 rows="1" />
  <CInputText value="value" multiline label="Label" mb-2 />
  <CInputText
    value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, est modi iusto repellendus fuga accusantium atque at magnam aliquam eum explicabo vero quia, nobis quasi quis! Earum amet quam a?"
    multiline
    mb-2
  />

  <CInputText
    value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, est modi iusto repellendus fuga accusantium atque at magnam aliquam eum explicabo vero quia, nobis quasi quis! Earum amet quam a?"
    multiline
    clearable
  />

  <h2>Autosize</h2>

  <CInputText v-model:value="value" label="Autosize" rows="1" multiline autosize mb-2 />
  <CInputText v-model:value="valueLong" label="Autosize monospace" rows="1" multiline autosize monospace mb-2 />

  <h2>Line numbers</h2>

  <CInputText
    ref="lineNumberInput"
    v-model:value="lineNumbersValue"
    label="Line numbers"
    rows="6"
    multiline
    monospace
    raw-text
    mb-2
  >
    <template #prefix>
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
        @click="focusLineNumbersInput"
      >
        <pre class="line-numbers__content" :style="{ transform: `translateY(-${lineNumbersOffset}px)` }">{{ lineNumbersText }}</pre>
      </div>
    </template>
  </CInputText>
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
