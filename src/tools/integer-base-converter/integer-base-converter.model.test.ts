import { describe, expect, it } from 'vitest';
import { convertBase, formatWithSpaces } from './integer-base-converter.model';

describe('integer-base-converter', () => {
  describe('convertBase', () => {
    describe('when the input and target bases are between 2 and 64', () => {
      it('should convert integer between different bases', () => {
        expect(convertBase({ value: '0', fromBase: 2, toBase: 11 })).toEqual('0');
        expect(convertBase({ value: '0', fromBase: 5, toBase: 2 })).toEqual('0');
        expect(convertBase({ value: '0', fromBase: 10, toBase: 16 })).toEqual('0');
        expect(convertBase({ value: '10100101', fromBase: 2, toBase: 16 })).toEqual('a5');
        expect(convertBase({ value: '192654', fromBase: 10, toBase: 8 })).toEqual('570216');
        expect(convertBase({ value: 'zz', fromBase: 64, toBase: 10 })).toEqual('2275');
        expect(convertBase({ value: 'AA', fromBase: 16, toBase: 10 })).toEqual('170');
        expect(convertBase({ value: 'aa', fromBase: 16, toBase: 10 })).toEqual('170');
        expect(convertBase({ value: '0xAA', fromBase: -1, toBase: 10 })).toEqual('170');
        expect(convertBase({ value: '&HAA', fromBase: -1, toBase: 10 })).toEqual('170');
        expect(convertBase({ value: '0xAAUL', fromBase: -1, toBase: 10 })).toEqual('170');
        expect(convertBase({ value: '0XAAUL', fromBase: -1, toBase: 10 })).toEqual('170');
        expect(convertBase({ value: '10UL', fromBase: 10, toBase: 10 })).toEqual('10');
        expect(convertBase({ value: '10n', fromBase: 10, toBase: 10 })).toEqual('10');
        expect(convertBase({ value: '0o252', fromBase: -1, toBase: 10 })).toEqual('170');
        expect(convertBase({ value: '&O252', fromBase: -1, toBase: 10 })).toEqual('170');
        expect(convertBase({ value: '192 654', fromBase: 10, toBase: 8 })).toEqual('570216');
        expect(convertBase({ value: '192.654', fromBase: 10, toBase: 8 })).toEqual('570216');
        expect(convertBase({ value: '0b10101010', fromBase: -1, toBase: 10 })).toEqual('170');
        expect(convertBase({ value: '0b_1010_1010', fromBase: -1, toBase: 10 })).toEqual('170');
        expect(convertBase({ value: '192,654', fromBase: 10, toBase: 8 })).toEqual('570216');
        expect(convertBase({ value: '42540766411283223938465490632011909384', fromBase: 10, toBase: 10 })).toEqual('42540766411283223938465490632011909384');
        expect(convertBase({ value: '42540766411283223938465490632011909384', fromBase: 10, toBase: 16 })).toEqual('20010db8000085a300000000ac1f8908');
        expect(convertBase({ value: '20010db8000085a300000000ac1f8908', fromBase: 16, toBase: 10 })).toEqual('42540766411283223938465490632011909384');
      });

      it('should convert integers even when containing spaces', () => {
        expect(convertBase({ value: '1010 0101', fromBase: 2, toBase: 16 })).toEqual('a5');
        expect(convertBase({ value: '192 654', fromBase: 10, toBase: 8 })).toEqual('570216');
      });
    });
  });

  describe('formatWithSpaces', () => {
    it('should format numbers with spaces correctly from right to left', () => {
      expect(formatWithSpaces('10100000000000001111000000000000', 8)).toEqual('10100000 00000000 11110000 00000000');
      expect(formatWithSpaces('a000f000', 4)).toEqual('a000 f000');
      expect(formatWithSpaces('24000170000', 3)).toEqual('24 000 170 000');
    });

    it('should handle edge cases', () => {
      expect(formatWithSpaces('', 3)).toEqual('');
      expect(formatWithSpaces('12', 3)).toEqual('12');
      expect(formatWithSpaces('123', 3)).toEqual('123');
      expect(formatWithSpaces('1234', 3)).toEqual('1 234');
      expect(formatWithSpaces('12345', 3)).toEqual('12 345');
      expect(formatWithSpaces('123456', 3)).toEqual('123 456');
      expect(formatWithSpaces('123', 0)).toEqual('123');
      expect(formatWithSpaces('123', -1)).toEqual('123');
    });
  });
});
