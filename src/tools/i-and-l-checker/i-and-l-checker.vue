<script setup lang="ts">
const inputText = ref('');
const ambiguousChars = ['I', 'l', '1', '0', 'O'];

function getColor(char: string) {
  switch (char) {
    case 'I': return '#0040f3';
    case 'l': return '#f39c12';
    case '1': return '#e74c3c';
    case 'O': return '#8e44ad';
    case '0': return '#06a085';
    default: return 'inherit';
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
      label="Text to check:"
      placeholder="Paste your text here..."
    />

    <c-card v-if="inputText" mb-1>
      <div class="highlighted-text" bordered>
        <span v-for="(char, index) in highlightedChars" :key="index">
          <span
            v-if="ambiguousChars.includes(char)"
            :style="{ backgroundColor: getColor(char), fontWeight: 'bold' }"
          >
            {{ char }}
          </span>
          <span v-else>{{ char }}</span>
        </span>
      </div>
    </c-card>

    <c-card title="Legend">
      <n-space class="legend" justify="center">
        <n-p>
          <span class="letter" :style="{ backgroundColor: getColor('I') }">I</span> - Uppercase letter i
        </n-p>
        <n-p>
          <span class="letter" :style="{ backgroundColor: getColor('l') }">l</span> - Lowercase letter L
        </n-p>
        <n-p>
          <span class="letter" :style="{ backgroundColor: getColor('1') }">1</span> - Number 1
        </n-p>
        <n-p>
          <span class="letter" :style="{ backgroundColor: getColor('0') }">0</span> - Number 0
        </n-p>
        <n-p>
          <span class="letter" :style="{ backgroundColor: getColor('O') }">O</span> - Uppercase letter O
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
