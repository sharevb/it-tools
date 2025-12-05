<script setup lang="ts">
import { ref, watch } from 'vue';
import { type ConvertedClass, convertCssToTailwind } from './css-to-tailwind.service';
import InputCopyable from '@/components/InputCopyable.vue';

const cssInput = ref('');
const convertedClasses = ref<ConvertedClass[]>([]);
const remInPx = ref(16);

function convertCss() {
  const result = convertCssToTailwind(cssInput.value, remInPx.value);
  // Ensure the result is an array before assigning
  convertedClasses.value = Array.isArray(result) ? result : [];
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    // Optionally show a success message
    // console.log('Copied to clipboard:', text);
  }).catch((err) => {
    console.error('Failed to copy text: ', err);
  });
}

// Example CSS input to demonstrate functionality with pseudo-classes
cssInput.value = `.my-button {
  background-color: #3490dc;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 5px;
}

.my-button:hover {
  background-color: #2563eb;
  color: #f0f0f0;
}

.my-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.card:active {
  transform: scale(0.98);
}`;

// Watch for changes to both cssInput and remInPx, and convert when either changes
watch([cssInput, remInPx], () => {
  convertCss();
}, { immediate: true });
</script>

<template>
  <div class="css-to-tailwind-converter">
    <div class="input-output-container">
      <div class="input-section">
        <h2>CSS Input</h2>
        <InputCopyable
          v-model:value="cssInput"
          multiline
          :rows="15"
          placeholder="Paste your CSS here..."
        />
      </div>

      <div class="output-section">
        <h2>Tailwind Classes Output</h2>
        <div class="output-content">
          <div
            v-for="convertedClass in convertedClasses"
            :key="convertedClass.className"
            class="class-output-block"
          >
            <div class="class-name-header">
              <span class="class-name">.{{ convertedClass.className }}<span v-if="convertedClass.pseudoClass">:{{ convertedClass.pseudoClass }}</span></span>
              <button
                class="copy-button"
                @click="copyToClipboard(convertedClass.tailwindClasses.join(' '))"
              >
                Copy
              </button>
            </div>
            <div class="tailwind-classes">
              {{ convertedClass.tailwindClasses.join(' ') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="action-section">
      <div class="settings-section">
        <label for="rem-input">1 rem =</label>
        <input
          id="rem-input"
          v-model.number="remInPx"
          type="number"
          min="1"
          step="1"
          class="rem-input"
        >
        <label for="rem-input">px</label>
      </div>
      <button
        class="convert-button"
        @click="convertCss"
      >
        Convert
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.css-to-tailwind-converter {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.input-output-container {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.input-section,
.output-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

h2 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.output-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 1rem;
  background-color: #f9f9f9;
}

.class-output-block {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 0.75rem;
  background-color: white;
}

.class-name-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.class-name {
  font-weight: bold;
  color: #2d3748;
}

.copy-button {
  padding: 0.25rem 0.5rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.copy-button:hover {
  background-color: #3182ce;
}

.tailwind-classes {
  font-family: monospace;
  word-break: break-all;
  color: #4a5568;
}

.action-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
}

.convert-button {
  padding: 0.75rem 1.5rem;
  background-color: #48bb78;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.convert-button:hover {
  background-color: #38a169;
}

.settings-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
}

.rem-input {
  width: 60px;
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  text-align: center;
}
</style>
