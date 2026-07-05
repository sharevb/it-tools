<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { bandsToNotation, notationToBands, notationToValue, valueToNotation } from 'resistor-data';

const { t } = useI18n();

const bandsInput = ref('');
const bandsResult = ref('');
const bandPreview = ref<string[]>([]);
const bandsError = ref('');
const bandCount = ref(4);
const bandOptions = [
  { label: t('tools.resistor-calculator.texts.label-4-band'), value: 4 },
  { label: t('tools.resistor-calculator.texts.label-5-band'), value: 5 },
  { label: t('tools.resistor-calculator.texts.label-6-band'), value: 6 },
];

const layout = ref('axial');

const notationInput = ref('');
const notationBandCount = ref(4);
const notationBandsResult = ref<string[]>([]);
const notationError = ref('');

const numberInput = ref(null);
const numberNotationResult = ref('');
const numberError = ref('');
const tolerance = ref(5);
const toleranceOptions = [
  { label: t('tools.resistor-calculator.texts.label-1'), value: 1 },
  { label: t('tools.resistor-calculator.texts.label-2'), value: 2 },
  { label: t('tools.resistor-calculator.texts.label-5'), value: 5 },
  { label: t('tools.resistor-calculator.texts.label-10'), value: 10 },
];

const notationToNumberInput = ref('');
const notationToNumberResult = ref(0);
const notationToNumberError = ref('');

const validColors = [
  'black', 'brown', 'red', 'orange', 'yellow', 'green',
  'blue', 'violet', 'gray', 'white', 'gold', 'silver',
];

function validateBands(bands: string[], count: number) {
  return bands.length === count && bands.every(b => validColors.includes(b));
}

function convertBandsToNotation() {
  bandsError.value = '';
  bandsResult.value = '';
  bandPreview.value = [];

  const bands = bandsInput.value.split(',').map(b => b.trim().toLowerCase());
  if (!validateBands(bands, bandCount.value)) {
    bandsError.value = `Please enter exactly ${bandCount.value} valid color bands (${validColors.join(', ')}).`;
    return;
  }

  try {
    const [notation, tolerance] = bandsToNotation(bands, bands.length);
    bandsResult.value = `${notation}Ω ±${tolerance}%`;
    bandPreview.value = bands;
  }
  catch (e: any) {
    bandsError.value = `Conversion failed. Check band order and values: ${e.toString()}`;
  }
}

function convertNotationToBands() {
  notationError.value = '';
  notationBandsResult.value = [];

  try {
    const [notation, tolerance] = notationInput.value.replace(/[Ω±%]/g, '').replace(/\s+/g, ' ').trim().split(' ');
    const bands = notationToBands([notation, Number(tolerance) || 1], notationBandCount.value);
    notationBandsResult.value = bands;
  }
  catch (e: any) {
    notationError.value = `Invalid notation format: ${e.toString()}`;
  }
}

function convertNumberToNotation() {
  numberError.value = '';
  numberNotationResult.value = '';

  if (typeof numberInput.value !== 'number' || numberInput.value <= 0) {
    numberError.value = 'Please enter a valid positive number.';
    return;
  }

  try {
    numberNotationResult.value = `${valueToNotation(numberInput.value)}Ω ±${tolerance.value}%`;
  }
  catch (e: any) {
    numberError.value = `Conversion failed: ${e.toString()}`;
  }
}

function convertNotationToNumber() {
  notationToNumberError.value = '';
  notationToNumberResult.value = 0;

  try {
    notationToNumberResult.value = notationToValue(notationToNumberInput.value);
  }
  catch (e: any) {
    notationToNumberError.value = `Invalid notation format: ${e.toString()}`;
  }
}

function getColorHex(color: string) {
  const map = { black: '#000000', brown: '#8B4513', red: '#FF0000', orange: '#FFA500', yellow: '#FFFF00', green: '#008000', blue: '#0000FF', violet: '#8A2BE2', gray: '#808080', white: '#FFFFFF', gold: '#FFD700', silver: '#C0C0C0' };
  return map[color as keyof typeof map] || '#ccc';
}
</script>

<template>
  <n-card :title="t('tools.resistor-calculator.texts.title-resistor-converter')" style="max-width: 700px; margin: auto;">
    <n-tabs type="line" animated>
      <!-- Bands → Notation -->
      <n-tab-pane name="bands-to-notation" :tab="t('tools.resistor-calculator.text.bands-notation')">
        <n-select v-model:value="bandCount" mb-1 :options="bandOptions" :label="t('tools.resistor-calculator.texts.label-band-count')" style="margin-bottom: 10px" />
        <n-input v-model:value="bandsInput" :placeholder="t('tools.resistor-calculator.texts.placeholder-e-g-red-violet-brown-gold')" />
        <n-p mb-2>
          Valid colors: {{ validColors.join(', ') }}
        </n-p>
        <n-space justify="center" mb-2>
          <n-button @click="convertBandsToNotation">
            {{ t('tools.resistor-calculator.texts.tag-convert') }}
          </n-button>
        </n-space>
        <n-alert v-if="bandsError" type="error">
          {{ bandsError }}
        </n-alert>
        <n-result v-if="bandsResult" mb-2 status="success" :title="t('tools.resistor-calculator.texts.title-standard-notation')" :description="bandsResult" />
        <n-space v-if="bandPreview.length" justify="center" mb-2>
          <n-tag v-for="(color, index) in bandPreview" :key="index" :style="{ 'background-color': getColorHex(color) }" round>
            {{ color }}
          </n-tag>
        </n-space>
        <n-space justify="center" mb-1>
          <n-radio-group v-model:value="layout">
            <n-radio-button value="axial">
              {{ t('tools.resistor-calculator.texts.tag-axial') }}
            </n-radio-button>
            <n-radio-button value="radial">
              {{ t('tools.resistor-calculator.texts.tag-radial') }}
            </n-radio-button>
          </n-radio-group>
        </n-space>
        <n-space justify="center" mb-1>
          <svg width="300" height="100" style="margin-top: 20px">
            <template v-if="layout === 'axial'">
              <rect x="50" y="40" width="200" height="20" rx="10" fill="#ccc" />
              <rect
                v-for="(color, index) in bandPreview"
                :key="index"
                :x="60 + index * 30"
                y="40"
                width="10"
                height="20"
                :fill="getColorHex(color)"
              />
              <line x1="30" y1="50" x2="50" y2="50" stroke="#888" stroke-width="2" />
              <line x1="250" y1="50" x2="270" y2="50" stroke="#888" stroke-width="2" />
            </template>
            <template v-else>
              <circle cx="150" cy="50" r="30" fill="#ccc" />
              <rect
                v-for="(color, index) in bandPreview"
                :key="index"
                :x="135 + index * 10"
                y="30"
                width="8"
                height="40"
                :fill="getColorHex(color)"
              />
              <line x1="150" y1="20" x2="150" y2="0" stroke="#888" stroke-width="2" />
              <line x1="150" y1="80" x2="150" y2="100" stroke="#888" stroke-width="2" />
            </template>
          </svg>
        </n-space>
      </n-tab-pane>

      <!-- Notation → Bands -->
      <n-tab-pane name="notation-to-bands" :tab="t('tools.resistor-calculator.text.notation-bands')">
        <n-input v-model:value="notationInput" :placeholder="t('tools.resistor-calculator.texts.placeholder-e-g-2k7ω-5-or-2k7-5')" mb-2 />
        <n-select v-model:value="notationBandCount" mb-1 :options="bandOptions" :label="t('tools.resistor-calculator.texts.label-band-count')" style="margin-bottom: 10px" />
        <n-space justify="center" mb-1>
          <n-button @click="convertNotationToBands">
            {{ t('tools.resistor-calculator.texts.tag-convert') }}
          </n-button>
        </n-space>
        <n-alert v-if="notationError" type="error" mb-1>
          {{ notationError }}
        </n-alert>
        <n-result v-if="notationBandsResult.length" mb-1 status="success" :title="t('tools.resistor-calculator.texts.title-resistor-bands')" :description="`Result: ${notationBandsResult.join(', ')}`" />
        <n-space v-if="notationBandsResult.length" justify="center" mb-3>
          <n-tag v-for="(color, index) in notationBandsResult" :key="index" :style="{ 'background-color': getColorHex(color) }" round>
            {{ color }}
          </n-tag>
        </n-space>
        <n-space justify="center" mb-1>
          <n-radio-group v-model:value="layout">
            <n-radio-button value="axial">
              {{ t('tools.resistor-calculator.texts.tag-axial') }}
            </n-radio-button>
            <n-radio-button value="radial">
              {{ t('tools.resistor-calculator.texts.tag-radial') }}
            </n-radio-button>
          </n-radio-group>
        </n-space>
        <n-space justify="center" mb-1>
          <svg width="300" height="100" style="margin-top: 20px">
            <template v-if="layout === 'axial'">
              <rect x="50" y="40" width="200" height="20" rx="10" fill="#ccc" />
              <rect
                v-for="(color, index) in notationBandsResult"
                :key="index"
                :x="60 + index * 30"
                y="40"
                width="10"
                height="20"
                :fill="getColorHex(color)"
              />
              <line x1="30" y1="50" x2="50" y2="50" stroke="#888" stroke-width="2" />
              <line x1="250" y1="50" x2="270" y2="50" stroke="#888" stroke-width="2" />
            </template>
            <template v-else>
              <circle cx="150" cy="50" r="30" fill="#ccc" />
              <rect
                v-for="(color, index) in notationBandsResult"
                :key="index"
                :x="135 + index * 10"
                y="30"
                width="8"
                height="40"
                :fill="getColorHex(color)"
              />
              <line x1="150" y1="20" x2="150" y2="0" stroke="#888" stroke-width="2" />
              <line x1="150" y1="80" x2="150" y2="100" stroke="#888" stroke-width="2" />
            </template>
          </svg>
        </n-space>
      </n-tab-pane>

      <!-- Number → Notation -->
      <n-tab-pane name="number-to-notation" :tab="t('tools.resistor-calculator.text.number-notation')">
        <n-input-number v-model:value="numberInput" :placeholder="t('tools.resistor-calculator.texts.placeholder-e-g-2700')" mb-1 />
        <n-select v-model:value="tolerance" :options="toleranceOptions" :label="t('tools.resistor-calculator.texts.label-tolerance')" mb-1 />
        <n-space justify="center" mb-1>
          <n-button @click="convertNumberToNotation">
            {{ t('tools.resistor-calculator.texts.tag-convert') }}
          </n-button>
        </n-space>
        <n-alert v-if="numberError" type="error">
          {{ numberError }}
        </n-alert>
        <n-result v-if="numberNotationResult" status="success" :title="t('tools.resistor-calculator.texts.title-standard-notation')" :description="`Result: ${numberNotationResult}`" />
      </n-tab-pane>

      <!-- Notation → Number -->
      <n-tab-pane name="notation-to-number" :tab="t('tools.resistor-calculator.text.notation-number')">
        <n-input v-model:value="notationToNumberInput" :placeholder="t('tools.resistor-calculator.texts.placeholder-e-g-2k7ω-5-or-2k7-5')" />
        <n-space justify="center" mb-1>
          <n-button @click="convertNotationToNumber">
            {{ t('tools.resistor-calculator.texts.tag-convert') }}
          </n-button>
        </n-space>
        <n-alert v-if="notationToNumberError" type="error">
          {{ notationToNumberError }}
        </n-alert>
        <n-result v-if="notationToNumberResult !== null" status="success" :title="t('tools.resistor-calculator.texts.title-numeric-value')" :description="`Result: ${notationToNumberResult}Ω`" />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
