// Only the MIT-licensed word lists: generateSillyPassword() picks words with Math.random()
import { allCreatures, attributes } from 'silly-password-generator/dist/passwords/words';
import { randFromArray, randIntFromInterval, shuffleArray } from '@/utils/random';

const firstWords = [...new Set(attributes.map((word) => word.toLowerCase()))];
const lastWords = [...new Set(allCreatures.map((word) => word.toLowerCase()))];
const anyWords = [...new Set([...firstWords, ...lastWords])];

export function generatePassphrase({
  wordCount,
  numberCount = 0,
  capitalize = false,
  separator = '-',
  salt = '',
}: {
  wordCount: number;
  numberCount?: number;
  capitalize?: boolean;
  separator?: string;
  salt?: string;
}): string {
  const count = Math.max(1, wordCount);
  const withNumbers = new Set(
    shuffleArray(Array.from({ length: count }, (_, i) => i)).slice(0, Math.max(0, numberCount)),
  );

  const words = Array.from({ length: count }, (_, i) => {
    // same shape as silly-password-generator: an attribute first, a creature last
    const pool = i === count - 1 ? lastWords : i === 0 ? firstWords : anyWords;
    const word = randFromArray(pool)!.split(/\s+/).join(separator);
    return withNumbers.has(i) ? word + randIntFromInterval(1, 100) : word;
  });

  const passphrase = words.join(separator) + salt;
  return capitalize ? passphrase.charAt(0).toUpperCase() + passphrase.slice(1) : passphrase;
}
