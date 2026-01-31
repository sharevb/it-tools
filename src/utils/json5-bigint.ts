import JSON5 from 'json5';

// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return JSON.rawJSON ? JSON.rawJSON(this.toString()) : this.toString();
};

function quoteLargeNumbers(jsonStr: string, minDigits: number): string {
  const strings: string[] = [];
  // Replace each string with its index
  const jsonWithoutStrings = jsonStr.replace(/"(?:\\.|[^"\\])*"/g, (str) => {
    const replacement = `"@${strings.length}@"`;
    strings.push(str);
    return replacement;
  });
  const regex = new RegExp(`([+-]?\\d{${minDigits},})(?=\\s*[,}\\]])`, 'g');
  // ensure to flag real numbers with ¤xxx¤ to not parse stringified numbers
  const jsonQuotedBigint = jsonWithoutStrings.replace(regex, '"¤$1¤"');
  return jsonQuotedBigint.replace(/"@(\d+)@"/g, (_, ix) => {
    return strings[Number(ix)];
  });
}

JSON.parseBigInt = function (jsonStr: string, options?: { minDigits?: number }): unknown {
  const minDigits = options?.minDigits ?? 15;

  const safeStr = quoteLargeNumbers(jsonStr, minDigits);
  const bigintRegex = new RegExp(`^¤[+-]?\\d{${minDigits},}¤$`);

  return JSON5.parse(safeStr, (_key, value) => {
    if (typeof value === 'string') {
      if (bigintRegex.test(value)) {
        const bigintValue = value.slice(1, -1);
        try {
          if (typeof BigInt !== 'undefined') {
            // take only part xxx between ¤xxx¤
            return BigInt(bigintValue);
          }
        }
        catch {
          return bigintValue;
        }
      }
    }
    return value;
  });
};
