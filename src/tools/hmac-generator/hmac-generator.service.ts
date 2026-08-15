import {
  Hex,
  HmacMD5,
  HmacRIPEMD160,
  HmacSHA1,
  HmacSHA3,
  HmacSHA224,
  HmacSHA256,
  HmacSHA384,
  HmacSHA512,
} from 'crypto-es';
import type { Encoding } from '../hash-text/hash-text.service';
import { formatWithEncoding } from '../hash-text/hash-text.service';

export const algos = {
  MD5: HmacMD5,
  RIPEMD160: HmacRIPEMD160,
  SHA1: HmacSHA1,
  SHA3: HmacSHA3,
  SHA224: HmacSHA224,
  SHA256: HmacSHA256,
  SHA384: HmacSHA384,
  SHA512: HmacSHA512,
} as const;

export type AlgoNames = keyof typeof algos;
export type KeyEncoding = 'Text' | 'Hex';

export function computeHmac({
  plainText,
  secret,
  hashFunction,
  keyEncoding,
  encoding,
}: {
  plainText: string
  secret: string
  hashFunction: AlgoNames
  keyEncoding: KeyEncoding
  encoding: Encoding
}) {
  // normalize secret according to the key encoding
  const key = keyEncoding === 'Text' ? secret : Hex.parse(secret);

  return formatWithEncoding(algos[hashFunction](plainText, key), encoding);
}
