import { describe, expect, it } from 'vitest';
import type { AlgoNames } from './hmac-generator.service';
import { algos, computeHmac } from './hmac-generator.service';

const plainText = 'The quick brown fox';
const secret = 'secret-key';

describe('hmac-generator', () => {
  describe('algos', () => {
    it('exposes the hash functions in the order the ui renders them', () => {
      expect(Object.keys(algos)).toEqual(['MD5', 'RIPEMD160', 'SHA1', 'SHA3', 'SHA224', 'SHA256', 'SHA384', 'SHA512']);
    });
  });

  describe('computeHmac', () => {
    it.each<[AlgoNames, string]>([
      ['MD5', 'fd9d5bf7eba2cee3bf0eefb3d35427a2'],
      ['RIPEMD160', '991ff9d8ec73656a80b39bd84311ce5c63c27f75'],
      ['SHA1', 'a1227cb668d79ba40f687f384e525074b477397c'],
      [
        'SHA3',
        '6bce2a56a578b542ab0e2858b44b25f158155c4ecb7b380a902c6792d74bff54f360193977e02e0b53b810085ddb68716a0540b9e1fff24cd8019213fda08e1d',
      ],
      ['SHA224', '3a3b5ff96301a710558afcb3a54368dbf3c11cb441428f805880a337'],
      ['SHA256', 'fb8626bea6af7aca505231f3fa99c27995e34bf32128625aac73ac2a67d8b409'],
      ['SHA384', '52d4b58187ef42c054ecd867b4fbea503901ab4554d67cc89fac6e8d59dbd8b0f636b40a3a02fec8c2f316bf30c34030'],
      [
        'SHA512',
        '8de43db68a03ce898fb535d3a8d199281e96368ec8ab755b49c12b1b718cf4228e9ab00b45de3b9175efa39759ff640d2b31490fb803ee5b924b1eca679b7a97',
      ],
    ])('computes an %s hmac with a plain text key', (hashFunction, expected) => {
      expect(computeHmac({ plainText, secret, hashFunction, keyEncoding: 'Text', encoding: 'Hex' })).toEqual(expected);
    });

    it('computes an hmac with an hexadecimal key', () => {
      expect(
        computeHmac({ plainText, secret: '00ff10ab', hashFunction: 'SHA256', keyEncoding: 'Hex', encoding: 'Hex' }),
      ).toEqual('31136fb961306fb90091e9ba85cbfb862b1ecaa62ab831e67540d346f3d39ca7');
    });

    it('treats a plain text key and its hexadecimal representation as different keys', () => {
      const asText = computeHmac({
        plainText,
        secret: '00ff10ab',
        hashFunction: 'SHA256',
        keyEncoding: 'Text',
        encoding: 'Hex',
      });
      const asHex = computeHmac({
        plainText,
        secret: '00ff10ab',
        hashFunction: 'SHA256',
        keyEncoding: 'Hex',
        encoding: 'Hex',
      });

      expect(asText).not.toEqual(asHex);
    });

    it('renders the hmac in every supported encoding', () => {
      const args = { plainText, secret, hashFunction: 'SHA256', keyEncoding: 'Text' } as const;

      expect(computeHmac({ ...args, encoding: 'Hex' })).toEqual(
        'fb8626bea6af7aca505231f3fa99c27995e34bf32128625aac73ac2a67d8b409',
      );
      expect(computeHmac({ ...args, encoding: 'Base64' })).toEqual(
        '+4YmvqavespQUjHz+pnCeZXjS/MhKGJarHOsKmfYtAk=',
      );
      expect(computeHmac({ ...args, encoding: 'Base64url' })).toEqual(
        '-4YmvqavespQUjHz-pnCeZXjS_MhKGJarHOsKmfYtAk',
      );
      expect(computeHmac({ ...args, encoding: 'Bin' })).toEqual(
        '1111101110000110001001101011111010100110101011110111101011001010010100000101001000110001111100111111101010011001110000100111100110010101111000110100101111110011001000010010100001100010010110101010110001110011101011000010101001100111110110001011010000001001',
      );
    });

    it('handles an empty message and an empty key', () => {
      expect(
        computeHmac({ plainText: '', secret: '', hashFunction: 'SHA256', keyEncoding: 'Text', encoding: 'Hex' }),
      ).toEqual('b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad');
    });

    it('handles an odd length hexadecimal key', () => {
      expect(
        computeHmac({ plainText: 'msg', secret: 'abc', hashFunction: 'SHA256', keyEncoding: 'Hex', encoding: 'Hex' }),
      ).toEqual('d89e19442aad8643ea8ef0e93f5e60b0f1ca3445357b77080ff844adb08e21b7');
    });
  });
});
