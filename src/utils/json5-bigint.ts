import JSON5 from 'json5';

function quoteLargeNumbers(jsonStr: string, minDigits: number): string {
  const regex = new RegExp(`(-?\\d{${minDigits},})(?=\\s*[,}\\]])`, 'g');
  return jsonStr.replace(regex, '"$1"');
}

JSON.parseBigInt = function (jsonStr: string, options?: { minDigits?: number; fallbackToString?: boolean }): unknown {
  const minDigits = options?.minDigits ?? 15;
  const fallbackToString = options?.fallbackToString ?? true;

  const safeStr = quoteLargeNumbers(jsonStr, minDigits);

  return JSON5.parse(safeStr, (_key, value) => {
    if (typeof value === 'string') {
      const bigintRegex = new RegExp(`^-?\\d{${minDigits},}$`);
      if (bigintRegex.test(value)) {
        try {
          if (typeof BigInt !== 'undefined') {
            return BigInt(value);
          }
          else if (fallbackToString) {
            return value;
          }
        }
        catch {
          return value;
        }
      }
    }
    return value;
  });
};
