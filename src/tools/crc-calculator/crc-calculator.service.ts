import crc from 'crc';

export const defaultCRCValues = {
  crc1: '',
  crc8: '',
  crc81wire: '',
  crc8dvbs2: '',
  crc16: '',
  crc16ccitt: '',
  crc16modbus: '',
  crc16kermit: '',
  crc16xmodem: '',
  crc24: '',
  crc32: '',
  crc32mpeg: '',
  crcjam: '',
};

export type AlgoNames = keyof typeof defaultCRCValues;

export const algoNames = Object.keys(defaultCRCValues) as AlgoNames[];

export function getCRCs(rawContent: Uint8Array | string) {
  const content = rawContent as Buffer | string;
  return {
    crc1: crc.crc1(content).toString(16),
    crc8: crc.crc8(content).toString(16),
    crc81wire: crc.crc81wire(content).toString(16),
    crc8dvbs2: crc.crc8dvbs2(content).toString(16),
    crc16: crc.crc16(content).toString(16),
    crc16ccitt: crc.crc16ccitt(content).toString(16),
    crc16modbus: crc.crc16modbus(content).toString(16),
    crc16kermit: crc.crc16kermit(content).toString(16),
    crc16xmodem: crc.crc16xmodem(content).toString(16),
    crc24: crc.crc24(content).toString(16),
    crc32: crc.crc32(content).toString(16),
    crc32mpeg: crc.crc32mpeg2(content).toString(16),
    crcjam: crc.crcjam(content).toString(16),
  };
}
