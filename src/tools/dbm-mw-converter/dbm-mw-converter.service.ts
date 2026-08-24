import { translate as t } from '@/plugins/i18n.plugin';

/**
 * Converts dBm to milliwatts (mW)
 * @param dbm - Power level in dBm
 * @returns Power level in milliwatts
 */
export function dbmToMw(dbm: number): number {
  return 10 ** (dbm / 10);
}

/**
 * Converts milliwatts (mW) to dBm
 * @param mw - Power level in milliwatts
 * @returns Power level in dBm
 */
export function mwToDbm(mw: number): number {
  if (mw <= 0) {
    throw new Error(t('tools.dbm-mw-converter.service.texts.power-in-milliwatts-must-be-greater-than-0'));
  }
  return 10 * Math.log10(mw);
}
