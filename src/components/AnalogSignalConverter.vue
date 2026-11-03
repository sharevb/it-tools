<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import AnalogGauge from './AnalogGauge.vue';
import { useCopy } from '@/composable/copy';
import {
  type SignalRange,
  formatSignalNumber,
  getCurrentLoopStatus,
  getLinearTransform,
  getSignalRangeStatus,
  scaleValue,
} from '@/utils/analog-signal';

export interface SignalPreset {
  label: string;
  min: number;
  max: number;
}

type Direction = 'signal-to-value' | 'value-to-signal';
type Side = 'signal' | 'engineering';
interface SideStatus {
  type: 'ok' | 'warning' | 'error';
  message: string;
}

const props = withDefaults(
  defineProps<{
    storageKey: string;
    signalLabel: string;
    signalUnit?: string;
    presets: SignalPreset[];
    defaultEngineering?: SignalRange & { unit: string };
    // The signal is an integer register (raw PLC value): also show the rounded value.
    integerSignal?: boolean;
    // Apply the NAMUR NE 43 diagnostic when the signal range is 4-20 mA.
    currentLoopDiagnostic?: boolean;
  }>(),
  {
    signalUnit: '',
    defaultEngineering: () => ({ min: 0, max: 100, unit: '%' }),
    integerSignal: false,
    currentLoopDiagnostic: false,
  },
);

const { t, locale } = useI18n();
const themeVars = useThemeVars();

const defaultPreset = props.presets[0] ?? { label: '', min: 0, max: 10 };

const signalMin = useStorage<number | null>(`${props.storageKey}:signal-min`, defaultPreset.min);
const signalMax = useStorage<number | null>(`${props.storageKey}:signal-max`, defaultPreset.max);
const engineeringMin = useStorage<number | null>(`${props.storageKey}:engineering-min`, props.defaultEngineering.min);
const engineeringMax = useStorage<number | null>(`${props.storageKey}:engineering-max`, props.defaultEngineering.max);
const engineeringUnit = useStorage(`${props.storageKey}:engineering-unit`, props.defaultEngineering.unit);
const direction = useStorage<Direction>(`${props.storageKey}:direction`, 'signal-to-value');

const toNumber = (value: number | null | undefined) => (typeof value === 'number' ? value : Number.NaN);

const signalRange = computed<SignalRange>(() => ({ min: toNumber(signalMin.value), max: toNumber(signalMax.value) }));
const engineeringRange = computed<SignalRange>(() => ({
  min: toNumber(engineeringMin.value),
  max: toNumber(engineeringMax.value),
}));
const rangeOf = (side: Side) => (side === 'signal' ? signalRange.value : engineeringRange.value);
const unitOf = (side: Side) => (side === 'signal' ? props.signalUnit : engineeringUnit.value);
const labelOf = (side: Side) =>
  side === 'signal' ? props.signalLabel : t('analogSignalConverter.texts.label-engineering-value');

const inputSide = computed<Side>(() => (direction.value === 'signal-to-value' ? 'signal' : 'engineering'));
const outputSide = computed<Side>(() => (direction.value === 'signal-to-value' ? 'engineering' : 'signal'));

const midpoint = ({ min, max }: SignalRange) => (min + max) / 2;
const inputValue = ref<number | null>(midpoint(rangeOf(inputSide.value)));

// Min must be strictly lower than max: an inverted range is almost always a typo.
const isRangeValid = (range: SignalRange) =>
  Number.isFinite(range.min) && Number.isFinite(range.max) && range.min < range.max;

const isSignalRangeInvalid = computed(() => !isRangeValid(signalRange.value));
const isEngineeringRangeInvalid = computed(() => !isRangeValid(engineeringRange.value));

const rangesError = computed(() => {
  if (!isRangeValid(signalRange.value)) {
    return t('analogSignalConverter.texts.error-signal-range');
  }
  if (!isRangeValid(engineeringRange.value)) {
    return t('analogSignalConverter.texts.error-engineering-range');
  }
  return '';
});

const outputValue = computed(() => {
  const value = toNumber(inputValue.value);
  if (rangesError.value || !Number.isFinite(value)) {
    return Number.NaN;
  }
  return scaleValue({ value, from: rangeOf(inputSide.value), to: rangeOf(outputSide.value) });
});

const valueOf = (side: Side) => (side === inputSide.value ? toNumber(inputValue.value) : outputValue.value);

// Swapping keeps the current operating point: the output becomes the new input.
function swapDirection() {
  const previousOutput = outputValue.value;
  direction.value = direction.value === 'signal-to-value' ? 'value-to-signal' : 'signal-to-value';
  inputValue.value = Number.isFinite(previousOutput)
    ? Number(formatSignalNumber(previousOutput))
    : midpoint(rangeOf(inputSide.value));
}

const CUSTOM_PRESET = 'custom';
const presetOptions = computed(() => [
  ...props.presets.map(({ label }, index) => ({ label, value: String(index) })),
  { label: t('analogSignalConverter.texts.preset-custom'), value: CUSTOM_PRESET },
]);

const selectedPreset = computed({
  get() {
    const index = props.presets.findIndex(({ min, max }) => min === signalMin.value && max === signalMax.value);
    return index === -1 ? CUSTOM_PRESET : String(index);
  },
  set(value: string) {
    const preset = props.presets[Number(value)];
    if (preset) {
      signalMin.value = preset.min;
      signalMax.value = preset.max;
    }
  },
});

const isCurrentLoop = computed(
  () => props.currentLoopDiagnostic && signalRange.value.min === 4 && signalRange.value.max === 20,
);

function getSignalStatus(value: number): SideStatus {
  if (isCurrentLoop.value) {
    const status = getCurrentLoopStatus(value);
    if (status === 'ok') {
      return { type: 'ok', message: t('analogSignalConverter.texts.status-ok') };
    }
    return {
      type: status.startsWith('failure') ? 'error' : 'warning',
      message: t(`analogSignalConverter.texts.loop-status-${status}`),
    };
  }

  const status = getSignalRangeStatus({ value, range: signalRange.value });
  if (status === 'ok') {
    return { type: 'ok', message: t('analogSignalConverter.texts.status-ok') };
  }
  // A live zero (e.g. 2-10 V) lets a value under the minimum reveal a broken wire.
  const hasLiveZero = Math.min(signalRange.value.min, signalRange.value.max) > 0;
  return {
    type: 'warning',
    message:
      status === 'below-range' && hasLiveZero
        ? t('analogSignalConverter.texts.status-below-live-zero')
        : t(`analogSignalConverter.texts.status-${status}`),
  };
}

function getEngineeringStatus(value: number): SideStatus {
  const status = getSignalRangeStatus({ value, range: engineeringRange.value });
  return status === 'ok'
    ? { type: 'ok', message: t('analogSignalConverter.texts.status-ok') }
    : { type: 'warning', message: t(`analogSignalConverter.texts.engineering-${status}`) };
}

function statusOf(side: Side): SideStatus | null {
  const value = valueOf(side);
  if (rangesError.value || !Number.isFinite(value)) {
    return null;
  }
  return side === 'signal' ? getSignalStatus(value) : getEngineeringStatus(value);
}

const inputStatus = computed(() => statusOf(inputSide.value));
const outputStatus = computed(() => statusOf(outputSide.value));

const formatWithUnit = (value: number, unit: string) =>
  Number.isFinite(value) ? `${formatSignalNumber(value)}${unit ? ` ${unit}` : ''}` : '';
const withUnit = (label: string, unit: string) => (unit ? `${label} (${unit})` : label);

const outputText = computed(() => formatWithUnit(outputValue.value, unitOf(outputSide.value)));
const roundedOutputText = computed(() =>
  props.integerSignal && outputSide.value === 'signal' && Number.isFinite(outputValue.value)
    ? formatWithUnit(Math.round(outputValue.value), props.signalUnit)
    : '',
);
const { copy: copyOutput } = useCopy({ source: () => formatSignalNumber(outputValue.value) });

// Significant digits rather than decimals: Siemens gains such as 100 / 27648 are tiny.
const formatCoefficient = (value: number) => String(Number(value.toPrecision(10)));

const formula = computed(() => {
  if (rangesError.value) {
    return '';
  }
  const { gain, offset } = getLinearTransform({ from: rangeOf(inputSide.value), to: rangeOf(outputSide.value) });
  const names = {
    signal: t('analogSignalConverter.texts.formula-signal'),
    engineering: t('analogSignalConverter.texts.formula-value'),
  };
  const product = `${names[outputSide.value]} = ${formatCoefficient(gain)} × ${names[inputSide.value]}`;
  return formatCoefficient(offset) === '0'
    ? product
    : `${product} ${offset < 0 ? '-' : '+'} ${formatCoefficient(Math.abs(offset))}`;
});

const referencePoints = computed(() => {
  if (rangesError.value) {
    return [];
  }
  return [0, 25, 50, 75, 100].map((percent) => {
    const signal = scaleValue({ value: percent, from: { min: 0, max: 100 }, to: signalRange.value });
    const value = scaleValue({ value: percent, from: { min: 0, max: 100 }, to: engineeringRange.value });
    return {
      percent: `${percent} %`,
      signal: formatWithUnit(props.integerSignal ? Math.round(signal) : signal, props.signalUnit),
      value: formatWithUnit(value, engineeringUnit.value),
    };
  });
});
</script>

<template>
  <div flex flex-col gap-3>
    <div class="converter-columns">
      <!-- Input -->
      <c-card class="column" :title="t('analogSignalConverter.texts.title-input')">
        <div class="side-label">
          {{ withUnit(labelOf(inputSide), unitOf(inputSide)) }}
        </div>
        <n-input-number-i18n v-model:value="inputValue" size="large" data-test-id="converter-input" />

        <AnalogGauge
          v-if="!rangesError"
          :min="rangeOf(inputSide).min"
          :max="rangeOf(inputSide).max"
          :value="valueOf(inputSide)"
          :unit="unitOf(inputSide)"
          :status="inputStatus?.type"
          data-test-id="input-gauge"
        />

        <div v-if="inputStatus" class="status" :class="inputStatus.type" data-test-id="input-status">
          <icon-mdi-check-circle v-if="inputStatus.type === 'ok'" />
          <icon-mdi-alert v-else />
          <span>{{ inputStatus.message }}</span>
        </div>
      </c-card>

      <!-- Parameters -->
      <c-card class="column" :title="t('analogSignalConverter.texts.title-parameters')">
        <!-- c-select keeps the label it was mounted with: remount it when the language changes -->
        <c-select
          :key="locale"
          v-model:value="selectedPreset"
          :options="presetOptions"
          :label="t('analogSignalConverter.texts.label-signal-type')"
          data-test-id="signal-preset"
        />

        <div class="side-label" mt-3>
          {{ withUnit(`${signalLabel} min / max`, signalUnit) }}
        </div>
        <div flex gap-2>
          <n-input-number-i18n
            v-model:value="signalMin"
            :status="isSignalRangeInvalid ? 'error' : undefined"
            flex-1
            :show-button="false"
            data-test-id="signal-min"
          />
          <n-input-number-i18n
            v-model:value="signalMax"
            :status="isSignalRangeInvalid ? 'error' : undefined"
            flex-1
            :show-button="false"
            data-test-id="signal-max"
          />
        </div>

        <div class="swap" my-4>
          <c-button
            round
            :title="t('analogSignalConverter.texts.swap-direction')"
            data-test-id="swap-direction"
            @click="swapDirection"
          >
            <icon-mdi-swap-horizontal text-20px />
            <span ml-2>{{ t('analogSignalConverter.texts.swap-direction') }}</span>
          </c-button>
        </div>

        <div class="side-label">
          {{ t('analogSignalConverter.texts.label-engineering-range') }}
        </div>
        <div flex gap-2>
          <n-input-number-i18n
            v-model:value="engineeringMin"
            :status="isEngineeringRangeInvalid ? 'error' : undefined"
            flex-1
            :show-button="false"
            data-test-id="engineering-min"
          />
          <n-input-number-i18n
            v-model:value="engineeringMax"
            :status="isEngineeringRangeInvalid ? 'error' : undefined"
            flex-1
            :show-button="false"
            data-test-id="engineering-max"
          />
        </div>

        <c-input-text
          v-model:value="engineeringUnit"
          :label="t('analogSignalConverter.texts.label-engineering-unit')"
          :placeholder="t('analogSignalConverter.texts.placeholder-unit')"
          mt-3
          data-test-id="engineering-unit"
        />

        <c-alert v-if="rangesError" type="error" mt-3>
          {{ rangesError }}
        </c-alert>

        <input-copyable
          v-else
          :label="t('analogSignalConverter.texts.label-formula')"
          :value="formula"
          mt-3
          data-test-id="formula"
        />
      </c-card>

      <!-- Output -->
      <c-card class="column" :title="t('analogSignalConverter.texts.title-output')">
        <div class="side-label">
          {{ withUnit(labelOf(outputSide), unitOf(outputSide)) }}
        </div>
        <div class="output-value">
          <span data-test-id="converter-output">{{ outputText || '—' }}</span>
          <c-button
            v-if="outputText"
            variant="text"
            circle
            :title="t('analogSignalConverter.texts.copy-output')"
            @click="copyOutput()"
          >
            <icon-mdi-content-copy />
          </c-button>
        </div>
        <div v-if="roundedOutputText" class="rounded-output" data-test-id="converter-output-rounded">
          {{ t('analogSignalConverter.texts.label-rounded-signal') }} : {{ roundedOutputText }}
        </div>

        <AnalogGauge
          v-if="!rangesError"
          :min="rangeOf(outputSide).min"
          :max="rangeOf(outputSide).max"
          :value="outputValue"
          :unit="unitOf(outputSide)"
          :status="outputStatus?.type"
          data-test-id="output-gauge"
        />

        <div v-if="outputStatus" class="status" :class="outputStatus.type" data-test-id="output-status">
          <icon-mdi-check-circle v-if="outputStatus.type === 'ok'" />
          <icon-mdi-alert v-else />
          <span>{{ outputStatus.message }}</span>
        </div>
      </c-card>
    </div>

    <c-card v-if="!rangesError" :title="t('analogSignalConverter.texts.title-reference-points')">
      <n-table size="small" data-test-id="reference-points">
        <thead>
          <tr>
            <th>{{ t('analogSignalConverter.texts.column-percent') }}</th>
            <th>{{ signalLabel }}</th>
            <th>{{ t('analogSignalConverter.texts.label-engineering-value') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="point of referencePoints" :key="point.percent">
            <td>{{ point.percent }}</td>
            <td>{{ point.signal }}</td>
            <td>{{ point.value }}</td>
          </tr>
        </tbody>
      </n-table>
    </c-card>
  </div>
</template>

<style scoped lang="less">
.converter-columns {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 12px;
  align-items: stretch;

  // Narrow screens: input, parameters and output stacked
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  .column {
    min-width: 0;
  }
}

.side-label {
  font-size: 13px;
  opacity: 0.75;
  margin-bottom: 6px;
}

.swap {
  display: flex;
  justify-content: center;
}

.output-value {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 40px;
  font-size: 28px;
  font-weight: 600;
  word-break: break-all;
}

.rounded-output {
  text-align: center;
  font-size: 13px;
  opacity: 0.75;
}

.status {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  line-height: 1.4;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }

  &.ok {
    color: v-bind('themeVars.successColor');
  }
  &.warning {
    color: v-bind('themeVars.warningColor');
  }
  &.error {
    color: v-bind('themeVars.errorColor');
  }
}
</style>
