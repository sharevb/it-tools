import _ from 'lodash';
import type { ConvertOptions } from './list-converter.types';
import { byOrder } from '@/utils/array';

export { convert };

function whenever<T, R>(condition: boolean | undefined, fn: (value: T) => R) {
  return (value: T) =>
    condition ? fn(value) : value;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildPrefixRegExp(userPattern?: string, autoLiteral?: string) {
  const parts = [userPattern, autoLiteral ? escapeRegExp(autoLiteral) : undefined].filter(Boolean) as string[];
  if (parts.length === 0) {
    return null;
  }
  return new RegExp(`^(?:${parts.join('|')})`, 'g');
}

function buildSuffixRegExp(userPattern?: string, autoLiteral?: string) {
  const parts = [userPattern, autoLiteral ? escapeRegExp(autoLiteral) : undefined].filter(Boolean) as string[];
  if (parts.length === 0) {
    return null;
  }
  return new RegExp(`(?:${parts.join('|')})$`, 'g');
}

function convert(list: string, options: ConvertOptions): string {
  const outputAsColumn = options.outputAsColumn ?? false;
  const lineBreak = outputAsColumn || options.keepLineBreaks ? '\n' : '';
  const itemsSeparator = outputAsColumn ? '' : (options.itemsSeparator || '');
  const itemPrefix = outputAsColumn ? '' : (options.itemPrefix || '');
  const itemSuffix = outputAsColumn ? '' : (options.itemSuffix || '');
  const listPrefix = outputAsColumn ? '' : (options.listPrefix || '');
  const listSuffix = outputAsColumn ? '' : (options.listSuffix || '');

  const splitSep = options.splitBySeparator ? `${options.splitBySeparator}|` : '';
  const splitRegExp = new RegExp(`(?:${splitSep}\\n)`, 'g');
  const filterRegExp = options.filterRegex ? new RegExp(options.filterRegex, 'v') : null;
  const notFilterRegExp = options.notFilterRegex ? new RegExp(options.notFilterRegex, 'v') : null;
  const removeItemPrefixRegExp = buildPrefixRegExp(options.removeItemPrefix, outputAsColumn ? options.itemPrefix : undefined);
  const removeItemSuffixRegExp = buildSuffixRegExp(options.removeItemSuffix, outputAsColumn ? options.itemSuffix : undefined);

  let sourceList = list;
  if (outputAsColumn && options.listPrefix) {
    sourceList = sourceList.replace(new RegExp(`^${escapeRegExp(options.listPrefix)}`), '');
  }
  if (outputAsColumn && options.listSuffix) {
    sourceList = sourceList.replace(new RegExp(`${escapeRegExp(options.listSuffix)}$`), '');
  }

  return _.chain(sourceList)
    .thru(whenever(options.lowerCase, text => text.toLowerCase()))
    .split(splitRegExp)
    .thru(whenever(options.removeDuplicates, _.uniq))
    .thru(whenever(options.reverseList, _.reverse))
    .map(whenever(options.trimItems, _.trim))
    .filter(text => filterRegExp === null || filterRegExp?.test(text))
    .filter(text => notFilterRegExp === null || !notFilterRegExp?.test(text))
    .thru(whenever(!!options.sortList, parts => parts.sort(byOrder({ order: options.sortList }))))
    .without('')
    .map(p => removeItemPrefixRegExp ? p.replace(removeItemPrefixRegExp, '') : p)
    .map(p => removeItemSuffixRegExp ? p.replace(removeItemSuffixRegExp, '') : p)
    .map(p => itemPrefix + p + itemSuffix)
    .join(itemsSeparator + lineBreak)
    .thru(text => [listPrefix, text, listSuffix].filter(l => l).join(lineBreak))
    .value();
}
