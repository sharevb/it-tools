import { describe, expect, it } from 'vitest';
import { algoNames, getCRCs } from './crc-calculator.service';
import { formatHexWithEncoding } from '../hash-text/hash-text.service';

describe('crc-calculator', () => {
  describe('algoNames', () => {
    it('exposes the algorithms in the order the ui renders them', () => {
      expect(algoNames).toEqual([
        'crc1',
        'crc8',
        'crc81wire',
        'crc8dvbs2',
        'crc16',
        'crc16ccitt',
        'crc16modbus',
        'crc16kermit',
        'crc16xmodem',
        'crc24',
        'crc32',
        'crc32mpeg',
        'crcjam',
      ]);
    });
  });

  describe('getCRCs', () => {
    it('computes every checksum of an empty string', () => {
      expect(getCRCs('')).toEqual({
        crc1: '0',
        crc8: '0',
        crc81wire: '0',
        crc8dvbs2: '0',
        crc16: '0',
        crc16ccitt: 'ffff',
        crc16modbus: 'ffff',
        crc16kermit: '0',
        crc16xmodem: '0',
        crc24: 'b704ce',
        crc32: '0',
        crc32mpeg: 'ffffffff',
        crcjam: 'ffffffff',
      });
    });

    it('computes every checksum of a string', () => {
      expect(getCRCs('Hello, World!')).toEqual({
        crc1: '69',
        crc8: '87',
        crc81wire: '9c',
        crc8dvbs2: '50',
        crc16: 'fa4d',
        crc16ccitt: '67da',
        crc16modbus: '114e',
        crc16kermit: '543e',
        crc16xmodem: '4fd6',
        crc24: 'df8bce',
        crc32: 'ec4ac3d0',
        crc32mpeg: '19270120',
        crcjam: '13b53c2f',
      });
    });

    it('matches the reference "123456789" check values', () => {
      expect(getCRCs('123456789')).toEqual({
        crc1: 'dd',
        crc8: 'f4',
        crc81wire: 'a1',
        crc8dvbs2: 'bc',
        crc16: 'bb3d',
        crc16ccitt: '29b1',
        crc16modbus: '4b37',
        crc16kermit: '2189',
        crc16xmodem: '31c3',
        crc24: '21cf02',
        crc32: 'cbf43926',
        crc32mpeg: '376e6e7',
        crcjam: '340bc6d9',
      });
    });

    it('computes every checksum of binary content', () => {
      expect(getCRCs(new Uint8Array([0, 1, 2, 254, 255]))).toEqual({
        crc1: '0',
        crc8: 'f1',
        crc81wire: 'b0',
        crc8dvbs2: '1c',
        crc16: '1ca0',
        crc16ccitt: '27e6',
        crc16modbus: '1c84',
        crc16kermit: '4063',
        crc16xmodem: '36ea',
        crc24: '705e51',
        crc32: 'da2767a8',
        crc32mpeg: 'b59ddd84',
        crcjam: '25d89857',
      });
    });
  });

  describe('checksum rendering', () => {
    it('re-encodes every checksum of "Hello, World!" as the ui does', () => {
      const hashes = getCRCs('Hello, World!');

      expect(algoNames.map(algo => formatHexWithEncoding(hashes[algo], 'Hex'))).toEqual([
        '69',
        '87',
        '9c',
        '50',
        'fa4d',
        '67da',
        '114e',
        '543e',
        '4fd6',
        'df8bce',
        'ec4ac3d0',
        '19270120',
        '13b53c2f',
      ]);
      expect(algoNames.map(algo => formatHexWithEncoding(hashes[algo], 'Base64'))).toEqual([
        'aQ==',
        'hw==',
        'nA==',
        'UA==',
        '+k0=',
        'Z9o=',
        'EU4=',
        'VD4=',
        'T9Y=',
        '34vO',
        '7ErD0A==',
        'GScBIA==',
        'E7U8Lw==',
      ]);
    });

    it('keeps the historical rendering of odd length checksums', () => {
      const hashes = getCRCs('');

      expect(formatHexWithEncoding(hashes.crc1, 'Hex')).toEqual('00');
      expect(formatHexWithEncoding(hashes.crc1, 'Base64')).toEqual('A===');
      expect(formatHexWithEncoding(hashes.crc1, 'Base64url')).toEqual('A');
      expect(formatHexWithEncoding(hashes.crc1, 'Bin')).toEqual('00000000');
    });
  });
});
