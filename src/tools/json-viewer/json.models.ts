import { type MaybeRef, get } from '@vueuse/core';
import { jsonrepair } from 'jsonrepair';
import '@/utils/json5-bigint';

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
    }, {} as Record<string, unknown>) as T;
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
  repairJson = false,
}: {
  rawJson: MaybeRef<string>
  sortKeys?: MaybeRef<boolean>
  indentSize?: MaybeRef<number>
  unescapeUnicode?: MaybeRef<boolean>
  repairJson?: MaybeRef<boolean>
}) {
  const unwrappedJson = get(rawJson);
  const jsonString = get(repairJson) ? jsonrepair(unwrappedJson) : unwrappedJson;
  const parsedObject = JSON.parseBigInt(get(unescapeUnicode) ? unescapeUnicodeJSON(jsonString) : jsonString);

  return JSON.stringify(get(sortKeys) ? sortObjectKeys(parsedObject) : parsedObject, null, get(indentSize));
}
