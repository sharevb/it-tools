import { Buffer } from 'node:buffer';
import { aeskw, aeskwp, cbc, cfb, ctr, ecb, gcm, siv } from '@noble/ciphers/aes';
import { chacha8, chacha12, chacha20, chacha20poly1305, xchacha20, xchacha20poly1305 } from '@noble/ciphers/chacha';
import { salsa20, xsalsa20, xsalsa20poly1305 } from '@noble/ciphers/salsa';
import { bytesToUtf8, hexToBytes, managedNonce, randomBytes, utf8ToBytes } from '@noble/ciphers/utils';
import { enc, Rabbit, RC4, TripleDES } from 'crypto-js';

function getCryptoJSKey(key: string, keyEncoding: KeyEncoding) {
  return keyEncoding === 'Text' ? key : enc.Hex.parse(key);
}
function getNobleKey(key: string, keyEncoding: KeyEncoding) {
  return keyEncoding === 'Text' ? utf8ToBytes(key) : hexToBytes(key);
}

function getCryptoJSCipher(cipher: any) {
  return {
    encrypt: (value: string, key: string, keyEncoding: KeyEncoding) => cipher.encrypt(value, getCryptoJSKey(key, keyEncoding), { iv: enc.Hex.parse('') }).toString(),
    decrypt: (value: string, key: string, keyEncoding: KeyEncoding) => cipher.decrypt(value, getCryptoJSKey(key, keyEncoding), { iv: enc.Hex.parse('') }).toString(enc.Utf8),
  };
}
function getNobleCipher(algo: any, nonceType: 'auto' | 'none' | 'manual' = 'auto', nonceSize: number = 0) {
  return {
    encrypt: (value: string, key: string, keyEncoding: KeyEncoding) => {
      if (nonceType === 'auto') {
        return Buffer.from((managedNonce(algo)(getNobleKey(key, keyEncoding)) as any).encrypt(utf8ToBytes(value))).toString('base64');
      }
      else if (nonceType === 'none') {
        return Buffer.from(algo(getNobleKey(key, keyEncoding)).encrypt(utf8ToBytes(value))).toString('base64');
      }
      else {
        const nonce = randomBytes(nonceSize);
        return Buffer.from(new Uint8Array([...nonce, ...algo(getNobleKey(key, keyEncoding), nonce, utf8ToBytes(value)) as any])).toString('base64');
      }
    },
    decrypt: (value: string, key: string, keyEncoding: KeyEncoding) => {
      if (nonceType === 'auto') {
        return bytesToUtf8((managedNonce(algo)(getNobleKey(key, keyEncoding)) as any).decrypt(Buffer.from(value, 'base64')));
      }
      else if (nonceType === 'none') {
        return bytesToUtf8(algo(getNobleKey(key, keyEncoding)).decrypt(Buffer.from(value, 'base64')));
      }
      else {
        const ciphered = Buffer.from(value, 'base64');
        return bytesToUtf8(algo(getNobleKey(key, keyEncoding), ciphered.subarray(0, nonceSize), ciphered.subarray(nonceSize)) as any);
      }
    },
  };
}

export const algos = {
  'TripleDES': getCryptoJSCipher(TripleDES),
  'Rabbit': getCryptoJSCipher(Rabbit),
  'RC4': getCryptoJSCipher(RC4),
  'AES-GCM': getNobleCipher(gcm),
  'AES-SIV': getNobleCipher(siv),
  'AES-CTR': getNobleCipher(ctr),
  'AES-CFB': getNobleCipher(cfb),
  'AES-CBC': getNobleCipher(cbc),
  'AES-ECB': getNobleCipher(ecb, 'none'),
  'AES-KW': getNobleCipher(aeskw, 'none'),
  'AES-KWP': getNobleCipher(aeskwp, 'none'),
  'Salsa-XSalsa20poly1305': getNobleCipher(xsalsa20poly1305),
  'Chacha-Chacha20poly1305': getNobleCipher(chacha20poly1305),
  'Chacha-XChacha20poly1305': getNobleCipher(xchacha20poly1305),
  'Salsa-Salsa20': getNobleCipher(salsa20, 'manual', 8),
  'Salsa-XSalsa20': getNobleCipher(xsalsa20, 'manual', 24),
  'Chacha-Chacha20': getNobleCipher(chacha20, 'manual', 12),
  'Chacha-XChacha20': getNobleCipher(xchacha20, 'manual', 24),
  'Chacha-Chacha8': getNobleCipher(chacha8, 'manual', 12),
  'Chacha-Chacha12 ': getNobleCipher(chacha12, 'manual', 12),
};

export type KeyEncoding = 'Text' | 'Hex';
