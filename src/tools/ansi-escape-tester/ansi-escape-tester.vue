<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  NButton, NCheckbox, NCheckboxGroup, NInput,
} from 'naive-ui';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import styles from 'ansi-styles';
import type { CSPair } from 'ansi-styles';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const terminalContainer = ref<HTMLElement | null>(null);

const decoratedText = useQueryParamOrStorage({ name: 'text', storageName: 'ansi:t', defaultValue: 'Sample text' });
const foregroundColor = useQueryParamOrStorage({ name: 'fg', storageName: 'ansi:fg', defaultValue: '' });
const backgroundColor = useQueryParamOrStorage({ name: 'bg', storageName: 'ansi:bg', defaultValue: '' });
const fontStyles = useQueryParamOrStorage({ name: 'styles', storageName: 'ansi:st', defaultValue: [] });
const colorMode = useQueryParamOrStorage({ name: 'mode', storageName: 'ansi:m', defaultValue: '256' });

const outputEscapeSequence = computed(() => {
  let openSeq = '';
  let closeSeq = '';

  if (foregroundColor.value) {
    if (colorMode.value === 'basic') {
      openSeq += styles.color.ansi(styles.hexToAnsi(foregroundColor.value));
    }
    else if (colorMode.value === '256') {
      openSeq += styles.color.ansi256(styles.hexToAnsi256(foregroundColor.value));
    }
    else {
      openSeq += styles.color.ansi16m(...styles.hexToRgb(foregroundColor.value));
    }
    closeSeq = styles.color.close + closeSeq;
  }
  if (backgroundColor.value) {
    if (colorMode.value === 'basic') {
      openSeq += styles.bgColor.ansi(styles.hexToAnsi(backgroundColor.value));
    }
    else if (colorMode.value === '256') {
      openSeq += styles.bgColor.ansi256(styles.hexToAnsi256(backgroundColor.value));
    }
    else {
      openSeq += styles.bgColor.ansi16m(...styles.hexToRgb(backgroundColor.value));
    }
    closeSeq = styles.bgColor.close + closeSeq;
  }

  fontStyles.value.forEach((style) => {
    if (styles.modifier[style]) {
      openSeq += (styles.modifier[style] as CSPair).open;
      closeSeq = (styles.modifier[style] as CSPair).close + closeSeq;
    }
  });

  return `${openSeq}${decoratedText.value}${closeSeq}`;
});

let term: Terminal;
function writeTermAndScrollBottom(text: string) {
  if (!term) {
    return;
  }
  term.writeln(text);
  term.scrollToBottom();
}
onMounted(() => {
  term = new Terminal({
    rows: 5,
  });
  term.open(terminalContainer.value!);
  writeTermAndScrollBottom(outputEscapeSequence.value);
});

watch(outputEscapeSequence, seq => writeTermAndScrollBottom(seq), { immediate: true });

const escapeSequenceToTest = ref('');
</script>

<template>
  <div>
    <NSpace justify="center">
      <n-form-item label="Mode:" label-placement="left">
        <n-radio-group v-model:value="colorMode">
          <n-radio value="basic">
            Basic
          </n-radio>
          <n-radio value="256">
            256-color
          </n-radio>
          <n-radio value="truecolor">
            Truecolor
          </n-radio>
        </n-radio-group>
      </n-form-item>
    </NSpace>

    <n-form-item label="Foreground:" label-placement="left" mb-1>
      <n-color-picker v-model:value="foregroundColor" :modes="['hex']" :show-alpha="false" :actions="['clear']" />
    </n-form-item>
    <n-form-item label="Background:" label-placement="left" mb-1>
      <n-color-picker v-model:value="backgroundColor" :modes="['hex']" :show-alpha="false" :actions="['clear']" />
    </n-form-item>

    <NSpace justify="center" mb-1>
      <n-form-item label="Styles:" label-placement="left">
        <NCheckboxGroup v-model:value="fontStyles">
          <NCheckbox value="bold">
            Bold
          </NCheckbox>
          <NCheckbox value="italic">
            Italic
          </NCheckbox>
          <NCheckbox value="underline">
            Underline
          </NCheckbox>
          <NCheckbox value="overline">
            Overline
          </NCheckbox>
          <NCheckbox value="inverse">
            Inverse
          </NCheckbox>
          <NCheckbox value="dim">
            Dim
          </NCheckbox>
          <NCheckbox value="strikethrough">
            Strikethrough
          </NCheckbox>
        </NCheckboxGroup>
      </n-form-item>
    </NSpace>

    <n-form-item label="Decorated text:" label-placement="left" mb-1>
      <NInput v-model:value="decoratedText" placeholder="Enter text" />
    </n-form-item>

    <c-card title="Output ANSI Escape Sequence:">
      <input-copyable v-model:value="outputEscapeSequence" readonly />
    </c-card>
    <c-card title="Terminal Preview:">
      <n-form-item label-placement="left" label="Custom ANSI Sequence:">
        <NInput v-model:value="escapeSequenceToTest" placeholder="Enter ANSI escape sequence" />
        <NButton type="primary" ml-1 @click="term?.writeln(escapeSequenceToTest)">
          Test
        </NButton>
        <NButton type="primary" ml-1 @click="term?.clear()">
          Clear
        </NButton>
      </n-form-item>
      <div ref="terminalContainer" class="terminal" />
    </c-card>
  </div>
</template>

<style scoped>
.terminal {
  height: 6em;
  background-color: black;
}
</style>
