import type { WordArray } from 'crypto-es';
import {
  Base64,
  Base64url,
  Hex,
  Latin1,
  MD5,
  RIPEMD160,
  SHA1,
  SHA3,
  SHA224,
  SHA256,
  SHA384,
  SHA512,
  Utf8,
  Utf16,
  Utf16BE,
  Utf16LE,
} from 'crypto-es';

export const encodings = {
  Hex,
  Latin1,
  Utf8,
  Utf16BE,
  Utf16,
  Utf16LE,
  Base64,
  Base64url,
};

export type Encoding = keyof typeof encodings | 'Bin';

export const algos = {
  MD5,
  SHA1,
  SHA256,
  SHA224,
  SHA512,
  SHA384,
  SHA3,
  RIPEMD160,
} as const;

export type AlgoNames = keyof typeof algos;

export const algoNames = Object.keys(algos) as AlgoNames[];

export function convertHexToBin(hex: string) {
  return hex
    .trim()
    .split('')
    .map(byte => Number.parseInt(byte, 16).toString(2).padStart(4, '0'))
    .join('');
}

export function formatWithEncoding(words: WordArray, encoding: Encoding) {
  if (encoding === 'Bin') {
    return convertHexToBin(words.toString(encodings.Hex));
  }

  return words.toString(encodings[encoding]);
}

// Re-encodes an already computed hexadecimal digest, as produced by the wasm hashers and the crc library.
export function formatHexWithEncoding(hex: string, encoding: Encoding) {
  return formatWithEncoding(encodings.Hex.parse(hex), encoding);
}

export function hashText(algo: AlgoNames, value: string, encoding: Encoding) {
  return formatWithEncoding(algos[algo](value), encoding);
}
