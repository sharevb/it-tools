import { describe, expect, it } from 'vitest';
import { algos } from './encryption.service';

const message = 'Lorem ipsum dolor sit amet';

// 32 bytes, so that every algorithm accepts it: the aes variants take 16/24/32 bytes and the
// salsa/chacha variants require exactly 32.
const hexKey = '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f';
const textKey = 'my secret key 16my secret key 16';

const algoNames = Object.keys(algos) as (keyof typeof algos)[];

// AES-KW only wraps key material: its input must be a multiple of 8 bytes, so arbitrary text is rejected.
const algoNamesAcceptingText = algoNames.filter(algo => algo !== 'AES-KW');

describe('encryption', () => {
  describe('algos', () => {
    it('exposes the algorithms in the order the ui renders them', () => {
      expect(algoNames).toEqual([
        'TripleDES',
        'Rabbit',
        'RC4',
        'AES-GCM',
        'AES-SIV',
        'AES-CTR',
        'AES-CFB',
        'AES-CBC',
        'AES-ECB',
        'AES-KW',
        'AES-KWP',
        'Salsa-XSalsa20poly1305',
        'Chacha-Chacha20poly1305',
        'Chacha-XChacha20poly1305',
        'Salsa-Salsa20',
        'Salsa-XSalsa20',
        'Chacha-Chacha20',
        'Chacha-XChacha20',
        'Chacha-Chacha8',
        'Chacha-Chacha12 ',
      ]);
    });
  });

  describe('round trip', () => {
    it.each(algoNamesAcceptingText)('%s encrypts and decrypts back with an hexadecimal key', (algo) => {
      expect(algos[algo].decrypt(algos[algo].encrypt(message, hexKey, 'Hex'), hexKey, 'Hex')).toEqual(message);
    });

    it.each(algoNamesAcceptingText)('%s encrypts and decrypts back with a plain text key', (algo) => {
      expect(algos[algo].decrypt(algos[algo].encrypt(message, textKey, 'Text'), textKey, 'Text')).toEqual(message);
    });

    // AES-KWP pads its input to a multiple of 8 bytes but still requires at least one byte.
    it.each(algoNamesAcceptingText.filter(algo => algo !== 'AES-KWP'))(
      '%s round trips an empty message',
      (algo) => {
        expect(algos[algo].decrypt(algos[algo].encrypt('', hexKey, 'Hex'), hexKey, 'Hex')).toEqual('');
      },
    );

    it('AES-KWP rejects an empty message', () => {
      expect(() => algos['AES-KWP'].encrypt('', hexKey, 'Hex')).toThrow('invalid plaintext length');
    });

    it.each(algoNamesAcceptingText)('%s round trips non-ascii content', (algo) => {
      const unicode = 'héllo € 日本 🔐';

      expect(algos[algo].decrypt(algos[algo].encrypt(unicode, hexKey, 'Hex'), hexKey, 'Hex')).toEqual(unicode);
    });

    it('AES-KW only accepts inputs whose length is a multiple of 8 bytes', () => {
      expect(() => algos['AES-KW'].encrypt(message, hexKey, 'Hex')).toThrow();
      expect(algos['AES-KW'].decrypt(algos['AES-KW'].encrypt('0123456789abcdef', hexKey, 'Hex'), hexKey, 'Hex')).toEqual(
        '0123456789abcdef',
      );
    });
  });

  // These pin the exact ciphertexts the tool has always produced, so that anything encrypted with a
  // previous version of it-tools can still be decrypted.
  describe('legacy ciphertexts', () => {
    it.each<[keyof typeof algos, string, string]>([
      ['TripleDES', '000102030405060708090a0b0c0d0e0f1011121314151617', 'U0hH7zp0yBXvfPYdKWdndZZkjfT9PmU/44Ked0J30Aw='],
      ['TripleDES', '00112233445566778899aabbccddeeff', '8jBStRvbRaOH+fBhicWLyqV6X1AaOpCkHv2ZYLNQADQ='],
      ['RC4', '000102030405060708090a0b0c0d0e0f1011121314151617', 'ZvyH7eY06NnEk/i8gGFhLM6N+y6Mf5ng+2I='],
      ['RC4', '00112233445566778899aabbccddeeff', 'yTTeMv8HCPWLLNQb8SoR+3vl4DnVN+pDBdU='],
      ['Rabbit', '000102030405060708090a0b0c0d0e0f1011121314151617', '5JiU/gRgzv1gHzE1LnoVPdTEUDEtw2NNjxw='],
      ['Rabbit', '00112233445566778899aabbccddeeff', 'RwdmiqzmfNyS7k/7VpCqdzE0UGdrF1F+k2o='],
    ])('%s with the hexadecimal key %s', (algo, key, expected) => {
      expect(algos[algo].encrypt(message, key, 'Hex')).toEqual(expected);
      expect(algos[algo].decrypt(expected, key, 'Hex')).toEqual(message);
    });

    it.each<[keyof typeof algos, string]>([
      ['TripleDES', 'U0hH7zp0yBXvfPYdKWdndZZkjfT9PmU/44Ked0J30Aw='],
      ['Rabbit', '5JiU/gRgzv1gHzE1LnoVPdTEUDEtw2NNjxw='],
      ['RC4', 'XEuDrMePwE0FSfOgbFoF/L6pUx2n7sXQA44='],
      ['AES-ECB', 'HT97lv4ramN0LrSKNLdEZXsMl3FnpUBzbnmb13zQ22M='],
      ['AES-KWP', 'oE0hxSLq5a1mPX1W8Rx33aXY8GwFeYnJcFt7k1xAhHhdJxs/EOyaJg=='],
    ])('%s is deterministic with the 32 byte hexadecimal key', (algo, expected) => {
      expect(algos[algo].encrypt(message, hexKey, 'Hex')).toEqual(expected);
      expect(algos[algo].decrypt(expected, hexKey, 'Hex')).toEqual(message);
    });

    it.each<[keyof typeof algos, string]>([
      ['TripleDES', 'U2FsdGVkX18x0ZcSvWVAPwBWufCZWGvkKEL4SC7VHCduC1hmGS6wgMRECvJlNjOo'],
      ['RC4', 'U2FsdGVkX18Qr/9zZ+1Xm/kGxEoD/GHWU+VbphyZxc1YPHMVVIU2WRal'],
      ['Rabbit', 'U2FsdGVkX1+PUswpDnaEQuYjAnWIrgOE54cwBGKSii7JDaEOltR01Uwc'],
    ])('%s decrypts an openssl salted ciphertext produced with a passphrase', (algo, ciphertext) => {
      expect(algos[algo].decrypt(ciphertext, 'my secret key 16', 'Text')).toEqual(message);
    });
  });

  describe('passphrase based ciphers', () => {
    it.each<keyof typeof algos>(['TripleDES', 'Rabbit', 'RC4'])(
      '%s salts every encryption, so the same input yields a different ciphertext',
      (algo) => {
        const first = algos[algo].encrypt(message, 'my secret key 16', 'Text');
        const second = algos[algo].encrypt(message, 'my secret key 16', 'Text');

        expect(first).not.toEqual(second);
        // base64 of the "Salted__" openssl header
        expect(first.startsWith('U2FsdGVkX1')).toBe(true);
        expect(algos[algo].decrypt(first, 'my secret key 16', 'Text')).toEqual(message);
        expect(algos[algo].decrypt(second, 'my secret key 16', 'Text')).toEqual(message);
      },
    );
  });

  describe('wrong keys', () => {
    it('does not return the clear text when decrypting with another key', () => {
      const ciphertext = algos.RC4.encrypt(message, hexKey, 'Hex');

      // the plain bytes decoded with the wrong key are not valid utf-8, which the ui surfaces as an error
      expect(() => algos.RC4.decrypt(ciphertext, 'f'.repeat(64), 'Hex')).toThrow('Malformed UTF-8 data');
    });

    it('does not return the clear text when an authenticated cipher is given another key', () => {
      const ciphertext = algos['AES-GCM'].encrypt(message, hexKey, 'Hex');

      expect(() => algos['AES-GCM'].decrypt(ciphertext, 'f'.repeat(64), 'Hex')).toThrow();
    });

    it('rejects a key that is not valid hexadecimal for the noble ciphers', () => {
      expect(() => algos['AES-GCM'].encrypt(message, 'not-hex', 'Hex')).toThrow();
    });

    it('rejects a 3DES key that is too short', () => {
      expect(() => algos.TripleDES.encrypt(message, 'aabb', 'Hex')).toThrow();
    });
  });
});
