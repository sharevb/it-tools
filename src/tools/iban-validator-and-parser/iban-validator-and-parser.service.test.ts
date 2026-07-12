// extractBICInfo.spec.ts
import { describe, it, expect } from 'vitest';
import { extractBICInfo } from './iban-validator-and-parser.service';

describe('extractBICInfo – predefined IBANs', () => {
  it('extracts BIC info for French IBAN', () => {
    const iban = 'FR76 3000 6000 0112 3456 7890 189';
    const result = extractBICInfo(iban);

    expect(result).to.deep.eq({
      bankCode: '30006',
      bankName: 'Crédit Agricole S.A.',
      bic: 'AGRIFRPPXXX',
    });
  });

  it('extracts BIC info for German IBAN', () => {
    const iban = 'DE89 3704 0044 0532 0130 00';
    const result = extractBICInfo(iban);

    expect(result).to.deep.eq({
      bankCode: '37040044',
      bankName: 'Commerzbank Köln',
      bic: 'COBADEFFXXX',
    });
  });

  it('extracts BIC info for UK IBAN', () => {
    const iban = 'GB29 NWBK 6016 1331 9268 19';
    const result = extractBICInfo(iban);

    expect(result).to.deep.eq({
      bankCode: 'NWBK',
      bankName: 'NATIONAL WESTMINSTER BANK PUBLIC LIMITED COMPANY',
      bic: 'NWBKGB2LXXX',
    });
  });
});
