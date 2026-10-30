<template>
  <div>
    <n-form label-placement="left" label-width="120px">
      <n-space>
        <n-form-item label="Mode:">
          <n-select v-model:value="mode" :options="modeOptions" style="width: 180px" />
        </n-form-item>

        <n-form-item label="Decimal Places:">
          <n-input-number v-model:value="decimalPlaces" :min="0" :max="8" style="width: 80px" />
        </n-form-item>

        <template v-if="mode === 'decimalToFraction'">
          <n-form-item label="Unit:">
            <n-select v-model:value="decimalUnit" :options="unitOptions" style="width: 120px" />
          </n-form-item>
          <n-form-item label="Fraction Resolution:" label-width="140px">
            <n-select v-model:value="maxDenominator" :options="denominatorOptions" style="width: 180px" />
          </n-form-item>
        </template>
      </n-space>

      <n-form-item label="Decimal Value:" v-if="mode === 'decimalToFraction'">
        <n-input-number v-model:value="decimalInput" style="width: 100%" />
      </n-form-item>

      <n-form-item label="Fraction:" v-if="mode === 'fractionToDecimal'">
        <n-input v-model:value="fractionInput" placeholder="e.g. 3/16 or 2 3/16" />
      </n-form-item>
    </n-form>

    <n-card title="Results">
      <template v-if="mode === 'fractionToDecimal'">
        <input-copyable :value="decimalInches" label="Decimal Inches:" label-position="left" label-width="120px" mb-1 />
        <input-copyable :value="millimeters" label="Millimeters:" label-position="left" label-width="120px" mb-1 />
      </template>

      <template v-else>
        <input-copyable :value="fractionResult" label="Fraction:" label-position="left" label-width="120px" mb-1 />
        <input-copyable
          :value="decimalInchesReverse"
          label="Decimal Inches:"
          label-position="left"
          label-width="120px"
          mb-1
        />
        <input-copyable
          :value="millimetersReverse"
          label="Millimeters:"
          label-position="left"
          label-width="120px"
          mb-1
        />
      </template>
    </n-card>
  </div>
</template>

<script setup lang="ts">
const mode = ref<'fractionToDecimal' | 'decimalToFraction'>('fractionToDecimal');

const fractionInput = ref('3/16');
const decimalInput = ref<number | null>(0.1875);
const decimalUnit = ref<'in' | 'mm'>('in');

const decimalPlaces = ref(4);
const maxDenominator = ref(64);

const modeOptions = [
  {
    label: 'Fraction → Decimal',
    value: 'fractionToDecimal',
  },
  {
    label: 'Decimal → Fraction',
    value: 'decimalToFraction',
  },
];

const unitOptions = [
  {
    label: 'Inches',
    value: 'in',
  },
  {
    label: 'Millimeters',
    value: 'mm',
  },
];

const denominatorOptions = [16, 32, 64, 128].map((v) => ({
  label: `1/${v}`,
  value: v,
}));

function parseFraction(value: string): number {
  value = value.trim();

  if (!value) {
    return 0;
  }

  if (value.includes(' ')) {
    const [wholePart, fractionPart] = value.split(' ');

    const [n, d] = fractionPart.split('/').map(Number);

    return Number(wholePart) + n / d;
  }

  if (value.includes('/')) {
    const [n, d] = value.split('/').map(Number);
    return n / d;
  }

  return Number(value);
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function decimalToMixedFraction(value: number, maxDenom: number): string {
  const whole = Math.floor(value);

  const remainder = value - whole;

  let numerator = Math.round(remainder * maxDenom);
  let denominator = maxDenom;

  if (numerator === 0) {
    return String(whole);
  }

  if (numerator === denominator) {
    return String(whole + 1);
  }

  const divisor = gcd(numerator, denominator);

  numerator /= divisor;
  denominator /= divisor;

  if (whole > 0) {
    return `${whole} ${numerator}/${denominator}`;
  }

  return `${numerator}/${denominator}`;
}

const inches = computed(() => parseFraction(fractionInput.value));

const decimalInches = computed(() => inches.value.toFixed(decimalPlaces.value));

const millimeters = computed(() => (inches.value * 25.4).toFixed(decimalPlaces.value));

const sourceInches = computed(() => {
  const value = decimalInput.value ?? 0;

  return decimalUnit.value === 'mm' ? value / 25.4 : value;
});

const fractionResult = computed(() => decimalToMixedFraction(sourceInches.value, maxDenominator.value));

const decimalInchesReverse = computed(() => sourceInches.value.toFixed(decimalPlaces.value));

const millimetersReverse = computed(() => (sourceInches.value * 25.4).toFixed(decimalPlaces.value));
</script>
