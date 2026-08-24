import { translate as t } from '@/plugins/i18n.plugin';

export interface EndianResult {
  bigEndian: string
  littleEndian: string
};

export function convertEndian(
  hexInput: string,
  bitLength: 16 | 32 | 64,
  middleEndianType: 'byte-swapped' | 'word-swapped',
): EndianResult {
  const hex = hexInput.replace(/^0x/, '').toUpperCase();

  if (!/^[0-9A-F]+$/.test(hex)) {
    throw new Error(t('tools.middle-endian-converter.service.texts.invalid-hex-input-only-0-9-and-a-f-allowed'));
  }

  const byteCount = bitLength / 8;
  if (hex.length !== byteCount * 2) {
    throw new Error(t('tools.middle-endian-converter.service.texts.input-must-be-bytecount-2-hex-characters-for-bitlength-bit', [byteCount * 2, bitLength]));
  }

  const bytes = hex.match(/.{2}/g);
  if (!bytes) {
    throw new Error(t('tools.middle-endian-converter.service.texts.failed-to-parse-bytes'));
  }

  const reordered: string[] = [];

  if (middleEndianType === 'byte-swapped') {
    for (let i = 0; i < bytes.length; i += 2) {
      reordered.push(bytes[i + 1], bytes[i]);
    }
  }
  else if (middleEndianType === 'word-swapped') {
    for (let i = 0; i < bytes.length; i += 4) {
      reordered.push(...bytes.slice(i + 2, i + 4), ...bytes.slice(i, i + 2));
    }
  }
  else {
    throw new Error(t('tools.middle-endian-converter.service.texts.unsupported-middle-endian-format'));
  }

  return {
    bigEndian: `0x${reordered.join('')}`,
    littleEndian: `0x${[...reordered].reverse().join('')}`,
  };
}

export function formatInteger(hexInput: string): {
  decimal: string
  octal: string
  hexadecimal: string
} {
  try {
    const hex = hexInput.replace(/^0x/, '');
    const intValue = BigInt(`0x${hex}`);

    return {
      decimal: intValue.toString(10),
      octal: `0o${intValue.toString(8)}`,
      hexadecimal: `0x${intValue.toString(16).toUpperCase()}`,
    };
  }
  catch {
    return {
      decimal: t('tools.middle-endian-converter.service.texts.invalid'),
      octal: t('tools.middle-endian-converter.service.texts.invalid-0'),
      hexadecimal: t('tools.middle-endian-converter.service.texts.invalid-1'),
    };
  }
}
