/* eslint-disable max-statements-per-line */
import emv, { type EmvBitDescription, type EmvTag } from 'node-emv';

/**
 * Utility functions
 */
function hexToBytes(hex: string): number[] {
  const clean = hex.replace(/\s+/g, '');
  if (clean.length % 2 !== 0) {
    throw new Error(`Invalid hex length: ${clean.length}`);
  }
  const out: number[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    out.push(Number.parseInt(clean.slice(i, i + 2), 16));
  }
  return out;
}

function hasBit(byte: number, bitIndex: number): boolean {
  return (byte & (1 << bitIndex)) !== 0;
}

/**
 * Tag 9F10 – Issuer Application Data (IAD)
 */
export function parse9F10_IAD(hex: string): string[] {
  const bytes = hexToBytes(hex);
  const results: string[] = [];
  results.push(`IAD length: ${bytes.length} bytes`);
  results.push(`Raw IAD: ${hex}`);

  // Heuristic scheme hint
  if (bytes.length === 22 || bytes.length === 24) { results.push('Likely Visa profile'); }
  else if (bytes.length === 32 || bytes.length === 34) { results.push('Likely Mastercard profile'); }
  else { results.push('Scheme unknown'); }

  results.push(`First byte (ARC/IAD version): 0x${bytes[0].toString(16).padStart(2, '0')}`);

  // Heuristic CVR extraction
  if (bytes.length >= 12) {
    const cvrBytes = bytes.slice(2, 6);
    results.push(`CVR (heuristic): ${cvrBytes.map(b => b.toString(16).padStart(2, '0')).join('')}`);
  }

  return results;
}

/**
 * Tag 9F33 – Terminal Capabilities
 */
export function parse9F33_TerminalCapabilities(hex: string): string[] {
  const bytes = hexToBytes(hex);
  if (bytes.length !== 3) { throw new Error('9F33 must be 3 bytes'); }
  const results: string[] = [];

  if (hasBit(bytes[0], 7)) { results.push('Cash transaction supported'); }
  if (hasBit(bytes[0], 6)) { results.push('Goods purchase supported'); }
  if (hasBit(bytes[0], 5)) { results.push('Services purchase supported'); }
  if (hasBit(bytes[0], 4)) { results.push('Cashback supported'); }

  if (hasBit(bytes[1], 7)) { results.push('Plaintext PIN for ICC supported'); }
  if (hasBit(bytes[1], 6)) { results.push('Enciphered PIN (online) supported'); }
  if (hasBit(bytes[1], 5)) { results.push('Signature supported'); }
  if (hasBit(bytes[1], 4)) { results.push('No CVM supported'); }

  if (hasBit(bytes[2], 7)) { results.push('Terminal risk management supported'); }
  if (hasBit(bytes[2], 6)) { results.push('Issuer authentication supported'); }
  if (hasBit(bytes[2], 5)) { results.push('CDA supported'); }

  return results;
}

/**
 * Tag 9F34 – CVM Results
 */
export function parse9F34_CVMResults(hex: string): string[] {
  const bytes = hexToBytes(hex);
  if (bytes.length !== 3) { throw new Error('9F34 must be 3 bytes'); }
  const results: string[] = [];

  results.push(`CVM Method Code: ${bytes[0]}`);
  results.push(`Condition Code: ${bytes[1]}`);

  if (hasBit(bytes[2], 7)) { results.push('CVM performed'); }
  if (hasBit(bytes[2], 6)) { results.push('CVM failed'); }
  if (hasBit(bytes[2], 5)) { results.push('Bypass attested'); }

  return results;
}

/**
 * Tag 9F40 – Additional Terminal Capabilities
 */
export function parse9F40_AdditionalTerminalCapabilities(hex: string): string[] {
  const bytes = hexToBytes(hex);
  if (bytes.length < 4) { throw new Error('9F40 must be at least 4 bytes'); }
  const results: string[] = [];

  if (hasBit(bytes[0], 7)) { results.push('Cash supported'); }
  if (hasBit(bytes[0], 6)) { results.push('Cashback supported'); }
  if (hasBit(bytes[0], 5)) { results.push('Purchase with cashback supported'); }
  if (hasBit(bytes[0], 4)) { results.push('Refund supported'); }

  if (hasBit(bytes[1], 7)) { results.push('Offline plaintext PIN supported'); }
  if (hasBit(bytes[1], 6)) { results.push('Offline enciphered PIN supported'); }
  if (hasBit(bytes[1], 5)) { results.push('Online PIN supported'); }
  if (hasBit(bytes[1], 4)) { results.push('Signature supported'); }

  if (hasBit(bytes[2], 7)) { results.push('SDA supported'); }
  if (hasBit(bytes[2], 6)) { results.push('DDA supported'); }
  if (hasBit(bytes[2], 5)) { results.push('CDA supported'); }
  if (hasBit(bytes[2], 4)) { results.push('Combined data authentication supported'); }

  return results;
}

/**
 * Tag 9F66 – TTQ (Terminal Transaction Qualifiers)
 */
export function parse9F66_TTQ(hex: string): string[] {
  const bytes = hexToBytes(hex);
  if (bytes.length < 4) { throw new Error('9F66 must be at least 4 bytes'); }
  const results: string[] = [];

  if (hasBit(bytes[0], 7)) { results.push('Contactless EMV mode supported'); }
  if (hasBit(bytes[0], 6)) { results.push('Contactless MSD mode supported'); }
  if (hasBit(bytes[0], 5)) { results.push('Contact EMV supported'); }
  if (hasBit(bytes[0], 4)) { results.push('Offline data authentication supported'); }

  if (hasBit(bytes[1], 7)) { results.push('No signature (QPS) supported'); }
  if (hasBit(bytes[1], 6)) { results.push('CVM required'); }
  if (hasBit(bytes[1], 5)) { results.push('Online PIN supported'); }
  if (hasBit(bytes[1], 4)) { results.push('Signature supported'); }

  if (hasBit(bytes[2], 7)) { results.push('Online cryptogram required'); }
  if (hasBit(bytes[2], 6)) { results.push('Issuer update processing supported'); }

  return results;
}

/**
 * Tag 9F6C – CTQ (Card Transaction Qualifiers)
 */
export function parse9F6C_CTQ(hex: string): string[] {
  const bytes = hexToBytes(hex);
  if (bytes.length < 2) { throw new Error('9F6C must be at least 2 bytes'); }
  const results: string[] = [];

  if (hasBit(bytes[0], 7)) { results.push('CVM required'); }
  if (hasBit(bytes[0], 6)) { results.push('Online PIN supported'); }
  if (hasBit(bytes[0], 5)) { results.push('Signature supported'); }
  if (hasBit(bytes[0], 4)) { results.push('No CVM supported'); }

  if (hasBit(bytes[1], 7)) { results.push('Offline approval possible'); }
  if (hasBit(bytes[1], 6)) { results.push('Online processing possible'); }
  if (hasBit(bytes[1], 5)) { results.push('CVM performed by card'); }

  return results;
}

/**
 * Tag 9F6E – FFI (Form Factor Indicator)
 */
export function parse9F6E_FFI(hex: string): string[] {
  const bytes = hexToBytes(hex);
  if (bytes.length < 1) { throw new Error('9F6E must be at least 1 byte'); }
  const results: string[] = [];

  const code = bytes[0];
  let description = 'Reserved/Other';
  if (code === 0x01) { description = 'Plastic card'; }
  else if (code === 0x02) { description = 'Mobile device'; }
  else if (code === 0x03) { description = 'Wearable'; }
  else if (code === 0x04) { description = 'Tokenized device'; }

  results.push(`Form Factor Code: ${code} (${description})`);

  if (bytes.length > 1) {
    results.push(`Extra bytes: ${bytes.slice(1).map(b => b.toString(16).padStart(2, '0')).join('')}`);
  }

  return results;
}

export function parseEmvData(tlvData: string, kernel: string) {
  let parsed: EmvTag[] = [];
  emv.describeKernel(tlvData, kernel, data => parsed = data);
  if (!parsed) {
    throw new Error('Invalid EMV TLV data');
  }

  const describeItem = (item: EmvTag): EmvTag => {
    if (Array.isArray(item.value)) {
      return {
        tag: item.tag,
        length: item.length,
        description: item.description,
        value: item.value.map(sub_item => describeItem(sub_item)),
      };
    }

    let bitDetails: string[] = [];

    const getActiveBitsDescriptions = (bits: EmvBitDescription[][]) => bits.flat().filter(b => b.description !== 'RFU').map(b => `${b.description}: ${(b.value === '1' ? 'yes' : 'no')}`);

    switch (item.tag) {
      case '95': // TVR
        emv.tvr(item.value, data => bitDetails = getActiveBitsDescriptions(data));
        break;
      case '9B': // TSI
        emv.tsi(item.value, data => bitDetails = getActiveBitsDescriptions(data));
        break;
      case '82': // AIP
        emv.aip(item.value, data => bitDetails = getActiveBitsDescriptions(data));
        break;
      case '8E': // CVM List
        emv.cvm(item.value, data => bitDetails = data);
        break;
      case '9F07': // AUC
        emv.auc(item.value, data => bitDetails = getActiveBitsDescriptions(data));
        break;
      case '9F10': // IAD
        bitDetails = parse9F10_IAD(item.value);
        break;
      case '9F33': // Terminal Capabilities
        bitDetails = parse9F33_TerminalCapabilities(item.value);
        break;
      case '9F34': // CVM Results
        bitDetails = parse9F34_CVMResults(item.value);
        break;
      case '9F40': // Additional Terminal Capabilities
        bitDetails = parse9F40_AdditionalTerminalCapabilities(item.value);
        break;
      case '9F66': // TTQ
        bitDetails = parse9F66_TTQ(item.value);
        break;
      case '9F6C': // CTQ
        bitDetails = parse9F6C_CTQ(item.value);
        break;
      case '9F6E': // FFI
        bitDetails = parse9F6E_FFI(item.value);
        break;
    }

    return {
      tag: item.tag,
      length: item.length,
      description: item.description,
      value: item.value,
      bitDetails,
    };
  };
  return parsed.map(describeItem);
}
