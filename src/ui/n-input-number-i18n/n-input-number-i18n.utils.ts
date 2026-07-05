export function countChar(str: string, char: string) {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      result++;
    }
  }
  return result;
};
export function parseNumber(value: string) {
  if (
    value === undefined
        || value === null
        || (typeof value === 'string' && value.trim() === '')
  ) {
    return null;
  }
  let cleanedValue = value.replace(/[^,\.\d-]/g, '');
  if (countChar(cleanedValue, ',') > 1) {
    cleanedValue = cleanedValue.replace(/,/g, '');
  }
  if (countChar(cleanedValue, '.') > 1) {
    cleanedValue = cleanedValue.replace(/\./g, '');
  }
  const parts = cleanedValue.split(/[,\.]/);
  if (parts.length === 1) {
    return Number(cleanedValue);
  }
  return Number(`${parts.slice(0, -1).join('')}.${parts.slice(-1)[0]}`);
}

export function formatNumber(n: number | null) {
  if (n === null) {
    return '';
  }
  return n.toString();
}
