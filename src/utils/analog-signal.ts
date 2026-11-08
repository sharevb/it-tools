export interface SignalRange {
  min: number;
  max: number;
}

export interface LinearTransform {
  gain: number;
  offset: number;
}

export type CurrentLoopStatus =
  | 'ok'
  | 'under-range'
  | 'over-range'
  | 'uncertain-low'
  | 'uncertain-high'
  | 'failure-low'
  | 'failure-high';

export type SignalRangeStatus = 'ok' | 'below-range' | 'above-range';

function assertNonEmptyRange(range: SignalRange) {
  if (!Number.isFinite(range.min) || !Number.isFinite(range.max) || range.min === range.max) {
    throw new Error('Invalid range: min and max must be finite and different');
  }
}

// y = gain * x + offset, mapping `from` onto `to` (what PLC scaling blocks compute).
export function getLinearTransform({ from, to }: { from: SignalRange; to: SignalRange }): LinearTransform {
  assertNonEmptyRange(from);

  const gain = (to.max - to.min) / (from.max - from.min);
  return { gain, offset: to.min - gain * from.min };
}

export function scaleValue({ value, from, to }: { value: number; from: SignalRange; to: SignalRange }): number {
  const { gain, offset } = getLinearTransform({ from, to });
  return gain * value + offset;
}

export function toPercentOfRange({ value, range }: { value: number; range: SignalRange }): number {
  return scaleValue({ value, from: range, to: { min: 0, max: 100 } });
}

export function getSignalRangeStatus({ value, range }: { value: number; range: SignalRange }): SignalRangeStatus {
  const low = Math.min(range.min, range.max);
  const high = Math.max(range.min, range.max);

  if (value < low) {
    return 'below-range';
  }
  if (value > high) {
    return 'above-range';
  }
  return 'ok';
}

// NAMUR NE 43 limits for 4-20 mA transmitters.
export const NAMUR_NE43 = {
  failureLowMax: 3.6,
  measurementMin: 3.8,
  measurementMax: 20.5,
  failureHighMin: 21,
} as const;

export function getCurrentLoopStatus(current: number): CurrentLoopStatus {
  if (current <= NAMUR_NE43.failureLowMax) {
    return 'failure-low';
  }
  if (current < NAMUR_NE43.measurementMin) {
    return 'uncertain-low';
  }
  if (current < 4) {
    return 'under-range';
  }
  if (current <= 20) {
    return 'ok';
  }
  if (current <= NAMUR_NE43.measurementMax) {
    return 'over-range';
  }
  if (current < NAMUR_NE43.failureHighMin) {
    return 'uncertain-high';
  }
  return 'failure-high';
}

// Avoids float noise such as 0.30000000000000004 in displayed results.
export function formatSignalNumber(value: number, maxDecimals = 4): string {
  if (!Number.isFinite(value)) {
    return '';
  }
  const rounded = Number(value.toFixed(maxDecimals));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}
