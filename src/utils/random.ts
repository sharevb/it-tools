// Backed by crypto.getRandomValues(): the token, password, passphrase, PIN and salt generators rely on these helpers.

const UINT32_RANGE = 2 ** 32;
const UINT53_RANGE = 2 ** 53;
const pool = new Uint32Array(256);
let poolIndex = pool.length;

function randomUint32(): number {
  if (poolIndex === pool.length) {
    crypto.getRandomValues(pool);
    poolIndex = 0;
  }
  return pool[poolIndex++];
}

const randomUint53 = () => (randomUint32() >>> 11) * UINT32_RANGE + randomUint32();

// Uniform integer in [0, max) for max up to 2^53, rejection sampling avoids modulo bias
function randIndex(max: number): number {
  if (!Number.isInteger(max) || max < 1 || max > UINT53_RANGE) {
    throw new RangeError(`randIndex: max must be an integer between 1 and 2^53, got ${max}`);
  }
  const [range, next] = max <= UINT32_RANGE ? [UINT32_RANGE, randomUint32] : [UINT53_RANGE, randomUint53];
  const limit = range - (range % max);
  let value = next();
  while (value >= limit) {
    value = next();
  }
  return value % max;
}

// Float in [0, 1) with 53 bits of precision, like Math.random()
const random = () => randomUint53() / UINT53_RANGE;

const randFromArray = <T>(array: T[]): T | undefined => (array.length > 0 ? array[randIndex(array.length)] : undefined);

const multiRandFromArray = <T>(array: T[], length: number) => Array.from({ length }, () => randFromArray(array));

// Integer in [min, max], both bounds included. Bounds can come from URL params, so reversed or fractional ones are
// normalised instead of throwing.
function randIntFromInterval(min: number, max: number): number {
  const low = Math.ceil(Math.min(min, max));
  const high = Math.floor(Math.max(min, max));
  if (!Number.isFinite(low) || !Number.isFinite(high)) {
    return Number.NaN;
  }
  if (high < low) {
    return low;
  }
  const width = high - low + 1;
  if (width <= UINT53_RANGE) {
    return low + randIndex(width);
  }
  // Past 2^53 not every integer is representable, so exact uniformity is moot. Interpolate so high - low cannot overflow.
  const r = random();
  return Math.min(high, Math.max(low, Math.floor(low * (1 - r) + high * r)));
}

// Durstenfeld shuffle
function shuffleArrayMutate<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randIndex(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const shuffleArray = <T>(array: T[]): T[] => shuffleArrayMutate([...array]);

const shuffleString = (str: string, delimiter = ''): string => shuffleArrayMutate(str.split(delimiter)).join(delimiter);

const generateRandomId = () => `id-${random().toString(36).substring(2, 12)}`;

export {
  randFromArray,
  multiRandFromArray,
  randIndex,
  randIntFromInterval,
  random,
  shuffleArray,
  shuffleArrayMutate,
  shuffleString,
  generateRandomId,
};
