import detectCSV from 'detect-csv';

export { getHeaders, convertCsvToArray };

function getHeaders(csv: string, delimiter: string): string[] {
  if (csv.trim() === '') {
    return [];
  }

  const firstLine = csv.split('\n')[0];
  return firstLine.split(new RegExp(`[${delimiter}]`)).map(header => header.trim());
}
function deserializeValue(value: string, tryParseValues: boolean): unknown {
  if (value === 'null') {
    return null;
  }

  if (value === '' || typeof value === 'undefined') {
    return undefined;
  }

  const valueAsString = value.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\"/g, '"');

  if (valueAsString.startsWith('"') && valueAsString.endsWith('"')) {
    return valueAsString.slice(1, -1);
  }

  if (!tryParseValues) {
    return valueAsString;
  }
  try {
    return JSON.parseBigNum(valueAsString);
  }
  catch (_) {
    return valueAsString;
  }
}

function convertCsvToArray(csv: string, tryParseValues: boolean = false): Record<string, unknown>[] {
  const delimiter = detectCSV(csv)?.delimiter || ',';
  const headers = getHeaders(csv, delimiter);

  return csv.split('\n').slice(1).map((line) => {
    // Split on comma or semicolon not within quotes
    const data = line.split(new RegExp(`[${delimiter}](?=(?:(?:[^"]*"){2})*[^"]*$)`)).map(value => value.trim());
    return headers.reduce((obj, header, index) => {
      obj[header] = deserializeValue(data[index], tryParseValues);
      return obj;
    }, {} as Record<string, unknown>);
  });
}
