import { describe, expect, it } from 'vitest';
import type { AlgoNames, Encoding } from './hash-text.service';
import { algoNames, convertHexToBin, formatHexWithEncoding, hashText } from './hash-text.service';

describe('hash text', () => {
  describe('convertHexToBin', () => {
    it('convert hex to bin', () => {
      expect(convertHexToBin('')).toEqual('');
      expect(convertHexToBin('FF')).toEqual('11111111');
      expect(convertHexToBin('F'.repeat(200))).toEqual('1111'.repeat(200));
      expect(convertHexToBin('2123006AD00F694CE120')).toEqual(
        '00100001001000110000000001101010110100000000111101101001010011001110000100100000',
      );
    });
  });

  describe('algoNames', () => {
    it('exposes the algorithms in the order the ui renders them', () => {
      expect(algoNames).toEqual(['MD5', 'SHA1', 'SHA256', 'SHA224', 'SHA512', 'SHA384', 'SHA3', 'RIPEMD160']);
    });
  });

  describe('hashText', () => {
    it.each<[AlgoNames, string]>([
      ['MD5', '65a8e27d8879283831b664bd8b7f0ad4'],
      ['SHA1', '0a0a9f2a6772942557ab5355d76af442f8f65e01'],
      ['SHA256', 'dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f'],
      ['SHA224', '72a23dfa411ba6fde01dbfabf3b00a709c93ebf273dc29e2d8b261ff'],
      [
        'SHA512',
        '374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6cc69291e0fa2fe0006a52570ef18c19def4e617c33ce52ef0a6e5fbe318cb0387',
      ],
      ['SHA384', '5485cc9b3365b4305dfb4e8337e0a598a574f8242bf17289e0dd6c20a3cd44a089de16ab4ab308f63e44b1170eb5f515'],
      [
        'SHA3',
        'eda765576c84c600ed7f5d97510e92703b61f5215def2a161037fd9dd1f5b6ed4f86ce46073c0e3f34b52de0289e9c618798fff9dd4b1bfe035bdb8645fc6e37',
      ],
      ['RIPEMD160', '527a6a4b9a6da75607546842e0e00105350b1aaf'],
    ])('hashes "Hello, World!" with %s', (algo, expected) => {
      expect(hashText(algo, 'Hello, World!', 'Hex')).toEqual(expected);
    });

    it.each<[AlgoNames, string]>([
      ['MD5', 'd41d8cd98f00b204e9800998ecf8427e'],
      ['SHA1', 'da39a3ee5e6b4b0d3255bfef95601890afd80709'],
      ['SHA256', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
      ['SHA224', 'd14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f'],
      [
        'SHA512',
        'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
      ],
      ['SHA384', '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b'],
      [
        'SHA3',
        '0eab42de4c3ceb9235fc91acffe746b29c29a8c366b7c60e4e67c466f36a4304c00fa9caf9d87976ba469bcbe06713b435f091ef2769fb160cdab33d3670680e',
      ],
      ['RIPEMD160', '9c1185a5c5e9fc54612808977ee8f548b2258d31'],
    ])('hashes the empty string with %s', (algo, expected) => {
      expect(hashText(algo, '', 'Hex')).toEqual(expected);
    });

    it('hashes non-ascii text as utf-8', () => {
      expect(hashText('MD5', 'héllo € 日本', 'Hex')).toEqual('7e7be0494c46bf5b05c19a5d30286957');
    });

    it('renders the digest in every supported encoding', () => {
      expect(hashText('SHA256', 'abc', 'Hex')).toEqual(
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      );
      expect(hashText('SHA256', 'abc', 'Base64')).toEqual('ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=');
      expect(hashText('SHA256', 'abc', 'Base64url')).toEqual('ungWv48Bz-pBQUDeXa4iI7ADYaOWF3qctBD_YfIAFa0');
      expect(hashText('SHA256', 'abc', 'Bin')).toEqual(
        '1011101001111000000101101011111110001111000000011100111111101010010000010100000101000000110111100101110110101110001000100010001110110000000000110110000110100011100101100001011101111010100111001011010000010000111111110110000111110010000000000001010110101101',
      );
    });
  });

  describe('formatHexWithEncoding', () => {
    // The 'Base64'/'Base64url' columns keep the historical behaviour for odd-length digests (as produced by
    // the crc tool): the trailing half-byte is zeroed before base64 encoding, while 'Hex' keeps it.
    it.each<[string, string, string, string, string]>([
      ['', '', '', '', ''],
      ['5', '00000101', '05', 'A===', 'A'],
      ['a', '00001010', '0a', 'A===', 'A'],
      ['abc', '1010101100001100', 'ab0c', 'qw==', 'qw'],
      ['deadbeef', '11011110101011011011111011101111', 'deadbeef', '3q2+7w==', '3q2-7w'],
      ['ffffffff', '11111111111111111111111111111111', 'ffffffff', '/////w==', '_____w'],
      ['0f0f0f0f0f', '0000111100001111000011110000111100001111', '0f0f0f0f0f', 'Dw8PDw8=', 'Dw8PDw8'],
      [
        '900150983cd24fb0d6963f7d28e17f72',
        '10010000000000010101000010011000001111001101001001001111101100001101011010010110001111110111110100101000111000010111111101110010',
        '900150983cd24fb0d6963f7d28e17f72',
        'kAFQmDzST7DWlj99KOF/cg==',
        'kAFQmDzST7DWlj99KOF_cg',
      ],
    ])('re-encodes the digest %s', (hex, bin, hexOut, base64, base64url) => {
      expect(formatHexWithEncoding(hex, 'Bin')).toEqual(bin);
      expect(formatHexWithEncoding(hex, 'Hex')).toEqual(hexOut);
      expect(formatHexWithEncoding(hex, 'Base64')).toEqual(base64);
      expect(formatHexWithEncoding(hex, 'Base64url')).toEqual(base64url);
    });

    it('does not mutate its input across successive encodings', () => {
      const encodings: Encoding[] = ['Hex', 'Base64', 'Hex', 'Base64url', 'Bin', 'Hex'];

      expect(encodings.map(encoding => formatHexWithEncoding('deadbeef', encoding))).toEqual([
        'deadbeef',
        '3q2+7w==',
        'deadbeef',
        '3q2-7w',
        '11011110101011011011111011101111',
        'deadbeef',
      ]);
    });
  });
});
