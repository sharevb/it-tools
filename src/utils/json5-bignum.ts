import JSON5 from 'json5';
import Decimal from 'decimal.js';

// strangely, Decimal.js serialize as strings by default
Decimal.prototype.toJSON = function () {
  return JSON.rawJSON ? JSON.rawJSON(this.toString()) : this.toString();
};

function quoteBigNumbers(jsonStr: string): string {
  const strings: string[] = [];
  // Replace each string with its index
  const jsonWithoutStrings = jsonStr.replace(/"(?:\\.|[^"\\])*"/g, (str) => {
    const replacement = `"@${strings.length}@"`;
    strings.push(str);
    return replacement;
  });
  const regex = /([+-]?\d*\.?\d+(?:[eE][+-]?\d+)?)(?=\s*[,}\]])/g;
  // ensure to flag real numbers with ¤xxx¤ to not parse stringified numbers
  const jsonQuotedBigint = jsonWithoutStrings.replace(regex, '"¤$1¤"');
  return jsonQuotedBigint.replace(/"@(\d+)@"/g, (_, ix) => {
    return strings[Number(ix)];
  });
}

const bignumRegex = /^¤[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?¤$/;
JSON.parseBigNum = function (jsonStr: string): unknown {
  const safeStr = quoteBigNumbers(jsonStr);

  return JSON5.parse(safeStr, (_key, value) => {
    if (typeof value === 'string') {
      if (bignumRegex.test(value)) {
        // take only part xxx between ¤xxx¤
        const number_string = value.slice(1, -1);
        try {
          const full_precision = new Decimal(number_string);
          const json_number = Number(number_string);
          if (json_number.toString() === full_precision.toString()) {
            return json_number;
          }
          else {
            return full_precision;
          }
        }
        catch {
          return number_string;
        }
      }
    }
    return value;
  });
};
