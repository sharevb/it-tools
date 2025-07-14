import { ValidationErrorsIBAN } from 'ibantools';

import { translate as t } from '@/plugins/i18n.plugin';

export { getFriendlyErrors };

const ibanErrorToMessage = {
  [ValidationErrorsIBAN.NoIBANProvided]: t('tools.iban-validator-and-parser.service.text.no-iban-provided'),
  [ValidationErrorsIBAN.NoIBANCountry]: t('tools.iban-validator-and-parser.service.text.no-iban-country'),
  [ValidationErrorsIBAN.WrongBBANLength]: t('tools.iban-validator-and-parser.service.text.wrong-bban-length'),
  [ValidationErrorsIBAN.WrongBBANFormat]: t('tools.iban-validator-and-parser.service.text.wrong-bban-format'),
  [ValidationErrorsIBAN.ChecksumNotNumber]: t('tools.iban-validator-and-parser.service.text.checksum-is-not-a-number'),
  [ValidationErrorsIBAN.WrongIBANChecksum]: t('tools.iban-validator-and-parser.service.text.wrong-iban-checksum'),
  [ValidationErrorsIBAN.WrongAccountBankBranchChecksum]: t('tools.iban-validator-and-parser.service.text.wrong-account-bank-branch-checksum'),
  [ValidationErrorsIBAN.QRIBANNotAllowed]: t('tools.iban-validator-and-parser.service.text.qr-iban-not-allowed'),
};

function getFriendlyErrors(errorCodes: ValidationErrorsIBAN[]) {
  return errorCodes.map(errorCode => ibanErrorToMessage[errorCode]).filter(Boolean);
}
