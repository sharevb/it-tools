<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const inputText = ref('');
const ambiguousChars = ['I', 'l', '1', '0', 'O'];

function getColor(char: string) {
  switch (char) {
    case 'I':
      return '#0040f3';
    case 'l':
      return '#f39c12';
    case '1':
      return '#e74c3c';
    case 'O':
      return '#8e44ad';
    case '0':
      return '#06a085';
    default:
      return 'inherit';
  }
}

const highlightedChars = computed(() => inputText.value.split(''));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputText"
      multiline
      mb-2
      :label="t('tools.i-and-l-checker.texts.label-text-to-check')"
      :placeholder="t('tools.i-and-l-checker.texts.placeholder-paste-your-text-here')"
    />

    <c-card v-if="inputText" mb-1>
      <div class="highlighted-text" bordered>
        <span v-for="(char, index) in highlightedChars" :key="index">
          <span v-if="ambiguousChars.includes(char)" :style="{ backgroundColor: getColor(char), fontWeight: 'bold' }">
            {{ char }}
          </span>
          <span v-else>{{ char }}</span>
        </span>
      </div>
    </c-card>

    <c-card :title="t('tools.i-and-l-checker.texts.title-legend')">
      <n-space class="legend" justify="center">
        <n-p>
          <span class="letter" :style="{ backgroundColor: getColor('I') }">{{
            t('tools.i-and-l-checker.texts.tag-i')
          }}</span
          >{{ t('tools.i-and-l-checker.texts.tag-uppercase-letter-i') }}
        </n-p>
        <n-p>
          <span class="letter" :style="{ backgroundColor: getColor('l') }">{{
            t('tools.i-and-l-checker.texts.tag-l')
          }}</span
          >{{ t('tools.i-and-l-checker.texts.tag-lowercase-letter-l') }}
        </n-p>
        <n-p>
          <span class="letter" :style="{ backgroundColor: getColor('1') }">{{
            t('tools.i-and-l-checker.texts.tag-1')
          }}</span
          >{{ t('tools.i-and-l-checker.texts.tag-number-1') }}
        </n-p>
        <n-p>
          <span class="letter" :style="{ backgroundColor: getColor('0') }">{{
            t('tools.i-and-l-checker.texts.tag-0')
          }}</span
          >{{ t('tools.i-and-l-checker.texts.tag-number-0') }}
        </n-p>
        <n-p>
          <span class="letter" :style="{ backgroundColor: getColor('O') }">{{
            t('tools.i-and-l-checker.texts.tag-o')
          }}</span
          >{{ t('tools.i-and-l-checker.texts.tag-uppercase-letter-o') }}
        </n-p>
      </n-space>
    </c-card>
  </div>
</template>

<style scoped>
.highlighted-text {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 2em;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: center;
}
.legend {
  font-family: monospace;
}
.legend .letter {
  font-size: 2em;
}
</style>
