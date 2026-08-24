const unitsConversion = {
  kb: { dec: 1_000, bin: 1024 },
  mb: { dec: 1_000_000, bin: 1024 * 1024 },
  gb: { dec: 1_000_000_000, bin: 1024 * 1024 * 1024 },
  tb: { dec: 1_000_000_000_000, bin: 1024 * 1024 * 1024 * 1024 },
  pb: { dec: 1_000_000_000_000_000, bin: 1024 * 1024 * 1024 * 1024 * 1024 },
};

export type Units = 'kb' | 'mb' | 'gb' | 'tb' | 'pb';

export function toBytes(value: number, unit: Units, type: 'dec' | 'bin') {
  return value * unitsConversion[unit][type];
}

export function fromBytes(bytes: number, unit: Units, type: 'dec' | 'bin') {
  return bytes / unitsConversion[unit][type];
}

export function getRealSize(claimedCapacity: number, claimedUnit: Units, toUnit: Units) {
  const bytes = toBytes(claimedCapacity, claimedUnit, 'dec');
  return fromBytes(bytes, toUnit, 'bin');
}
