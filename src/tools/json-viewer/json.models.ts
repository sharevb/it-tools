import { type MaybeRef, get } from '@vueuse/core';
import { jsonrepair } from 'jsonrepair';
import '@/utils/json5-bignum';

export { sortObjectKeys, formatJson };

function sortObjectKeys<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys) as unknown as T;
  }

  return Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .reduce((sortedObj, key) => {
      sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
      return sortedObj;
    }, Object.create(obj, {}) as Record<string, unknown>) as T;
}

function unescapeUnicodeJSON(str: string) {
  return str.replace(/\\u([\dA-Fa-f]{4})/g, (match, grp) =>
    String.fromCharCode(Number.parseInt(grp, 16)),
  );
}

function formatJson({
  rawJson,
  sortKeys = true,
  indentSize = 3,
  unescapeUnicode = false,
  unescapeJsonString = false,
  repairJson = false,
}: {
  rawJson: MaybeRef<string>
  sortKeys?: MaybeRef<boolean>
  indentSize?: MaybeRef<number>
  unescapeUnicode?: MaybeRef<boolean>
  unescapeJsonString?: MaybeRef<boolean>
  repairJson?: MaybeRef<boolean>
}) {
  let unwrappedJson = get(rawJson);
  if (get(unescapeJsonString)) {
    if (unwrappedJson.startsWith('\'') && unwrappedJson.endsWith('\'')) {
      unwrappedJson = unwrappedJson.slice(1, -1);
    }
    unwrappedJson = JSON.parse(
      (!unwrappedJson.startsWith('"') ? '"' : '')
      + unwrappedJson
      + (!unwrappedJson.endsWith('"') ? '"' : ''),
    );
  }
  const jsonString = get(repairJson) ? jsonrepair(unwrappedJson) : unwrappedJson;
  const parsedObject = JSON.parseBigNum(get(unescapeUnicode) ? unescapeUnicodeJSON(jsonString) : jsonString);

  return JSON.stringify(get(sortKeys) ? sortObjectKeys(parsedObject) : parsedObject, null, get(indentSize));
}
