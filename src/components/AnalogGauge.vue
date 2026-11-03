<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { formatSignalNumber } from '@/utils/analog-signal';

const props = withDefaults(
  defineProps<{
    min: number;
    max: number;
    value: number;
    unit?: string;
    status?: 'ok' | 'warning' | 'error';
  }>(),
  {
    unit: '',
    status: 'ok',
  },
);

const themeVars = useThemeVars();

const isValid = computed(() => Number.isFinite(props.min) && Number.isFinite(props.max) && props.min !== props.max);

// Position in the range, in percent; may go outside of 0-100 when the value is out of range.
const percent = computed(() =>
  isValid.value && Number.isFinite(props.value)
    ? ((props.value - props.min) / (props.max - props.min)) * 100
    : Number.NaN,
);
const clampedPercent = computed(() => (Number.isFinite(percent.value) ? Math.min(100, Math.max(0, percent.value)) : 0));
const isOutOfRange = computed(() => percent.value < 0 || percent.value > 100);

const fillColor = computed(
  () =>
    ({
      ok: themeVars.value.primaryColor,
      warning: themeVars.value.warningColor,
      error: themeVars.value.errorColor,
    })[props.status],
);

const withUnit = (value: number) => `${formatSignalNumber(value)}${props.unit ? ` ${props.unit}` : ''}`;
const middle = computed(() => (props.min + props.max) / 2);
</script>

<template>
  <div class="analog-gauge" :class="{ 'out-of-range': isOutOfRange }" data-test-id="gauge">
    <div class="scale">
      <span>{{ withUnit(max) }}</span>
      <span>{{ withUnit(middle) }}</span>
      <span>{{ withUnit(min) }}</span>
    </div>

    <div class="tube" role="meter" :aria-valuemin="min" :aria-valuemax="max" :aria-valuenow="value">
      <div class="fill" :style="{ height: `${clampedPercent}%`, backgroundColor: fillColor }" />
      <div class="tick" style="bottom: 25%" />
      <div class="tick" style="bottom: 50%" />
      <div class="tick" style="bottom: 75%" />
    </div>

    <div class="marker-track">
      <div v-if="Number.isFinite(percent)" class="marker" :style="{ bottom: `${clampedPercent}%`, color: fillColor }">
        ◄ {{ formatSignalNumber(percent, 1) }} %
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.analog-gauge {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 8px;
  height: 200px;
  margin: 16px 0;

  .scale {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 12px;
    opacity: 0.7;
    white-space: nowrap;
    // Labels sit on the top, middle and bottom lines of the tube
    margin: -8px 0;
  }

  .tube {
    position: relative;
    width: 28px;
    border-radius: 6px;
    overflow: hidden;
    background-color: v-bind('themeVars.buttonColor2');
    border: 1px solid v-bind('themeVars.borderColor');

    .fill {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      transition:
        height 0.25s ease-out,
        background-color 0.25s;
    }

    .tick {
      position: absolute;
      left: 0;
      width: 8px;
      height: 1px;
      background-color: v-bind('themeVars.textColor3');
    }
  }

  .marker-track {
    position: relative;
    width: 72px;

    .marker {
      position: absolute;
      left: 0;
      transform: translateY(50%);
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      transition: bottom 0.25s ease-out;
    }
  }

  &.out-of-range .tube {
    border-color: v-bind('fillColor');
  }
}
</style>
