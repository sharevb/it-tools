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
    .reduce(
      (sortedObj, key) => {
        sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
        return sortedObj;
      },
      Object.create(obj, {}) as Record<string, unknown>,
    ) as T;
}

function unescapeUnicodeJSON(str: string) {
  return str.replace(/\\u([\dA-Fa-f]{4})/g, (match, grp) => String.fromCharCode(Number.parseInt(grp, 16)));
}

const JSON_STRING_ESCAPES: Record<string, string> = {
  '"': '"',
  '\\': '\\',
  '/': '/',
  n: '\n',
  r: '\r',
  t: '\t',
  f: '\f',
  b: '\b',
};

function unescapeJson(jsonString: string): string {
  try {
    // First, try to handle double-escaped scenarios
    let result = jsonString.trim();

    // If the string starts and ends with quotes, and contains escaped quotes inside,
    // it might be a JSON string that needs to be unescaped
    if ((result.startsWith('"') && result.endsWith('"')) || (result.startsWith("'") && result.endsWith("'"))) {
      // Remove outer quotes first
      result = result.slice(1, -1);
    }

    // Handle common escape sequences in a single pass, so an escaped backslash
    // is not unescaped twice: `\\\\n` becomes `\\n`, not a newline
    result = result.replace(/\\(["\\/nrtfb])/g, (_, char: string) => JSON_STRING_ESCAPES[char]);

    return result;
  } catch {
    return jsonString;
  }
}

function formatJson({
  rawJson,
  sortKeys = true,
  indentSize = 3,
  unescapeUnicode = false,
  unescapeJsonString = false,
  repairJson = false,
}: {
  rawJson: MaybeRef<string>;
  sortKeys?: MaybeRef<boolean>;
  indentSize?: MaybeRef<number>;
  unescapeUnicode?: MaybeRef<boolean>;
  unescapeJsonString?: MaybeRef<boolean>;
  repairJson?: MaybeRef<boolean>;
}) {
  let unwrappedJson = get(rawJson)?.trim();
  if (get(unescapeJsonString)) {
    unwrappedJson = unescapeJson(unwrappedJson);
  }
  const jsonString = get(repairJson) ? jsonrepair(unwrappedJson) : unwrappedJson;
  const parsedObject = JSON.parseBigNum(get(unescapeUnicode) ? unescapeUnicodeJSON(jsonString) : jsonString);

  return JSON.stringify(get(sortKeys) ? sortObjectKeys(parsedObject) : parsedObject, null, get(indentSize));
}
