import type { ConvertOptions } from './list-converter.types';
import { byOrder } from '@/utils/array';

export { convert };

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

  const text = options.lowerCase ? sourceList.toLowerCase() : sourceList;

  let parts = text.split(splitRegExp);
  if (options.removeDuplicates) {
    parts = [...new Set(parts)];
  }
  if (options.reverseList) {
    parts = parts.reverse();
  }
  if (options.trimItems) {
    parts = parts.map(part => part.trim());
  }
  parts = parts
    .filter(part => filterRegExp === null || filterRegExp?.test(part))
    .filter(part => notFilterRegExp === null || !notFilterRegExp?.test(part));
  if (options.sortList) {
    parts = parts.sort(byOrder({ order: options.sortList }));
  }
  const joined = parts
    .filter(part => part !== '')
    .map(p => removeItemPrefixRegExp ? p.replace(removeItemPrefixRegExp, '') : p)
    .map(p => removeItemSuffixRegExp ? p.replace(removeItemSuffixRegExp, '') : p)
    .map(p => itemPrefix + p + itemSuffix)
    .join(itemsSeparator + lineBreak);

  return [listPrefix, joined, listSuffix].filter(l => l).join(lineBreak);
}
