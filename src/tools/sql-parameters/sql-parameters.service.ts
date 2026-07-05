export function detectTypeAndEscape(val: string | null | undefined) {
  if (val === null || val === undefined || val.toLowerCase?.() === 'null') {
    return 'NULL';
  }
  if (!Number.isNaN(Number(val)) && val.trim() !== '') {
    return val.includes('.') ? Number.parseFloat(val) : Number.parseInt(val);
  }
  return `'${val.replace(/'/g, '\'\'')}'`;
}

export function generateSQLFromTemplate(template: string, parameters: Array<{ key: string; value: string }>) {
  const paramMap = new Map();
  const indexedParams: Array<{ key: string; value: string }> = [];
  let keyIndex = 0;
  parameters.forEach(({ key, value }) => {
    if (key !== '' && !/^\d+$/.test(key)) {
      paramMap.set(key, detectTypeAndEscape(value));
    }
    else {
      const indexKey = (keyIndex++).toString();
      indexedParams.push({ key: indexKey, value });
    }
  });

  let sql = template;
  let error = null;

  // Replace named parameters
  sql = sql.replace(/(:\w+|@\w+)/g, (match) => {
    const key = match.slice(1);
    if (!paramMap.has(key)) {
      error = `Missing value for named parameter "${match}"`;
      return match;
    }
    return paramMap.get(key);
  });

  // Replace positional parameters
  let positionalIndex = 0;
  const positionalParams = indexedParams.filter(p => /^\d+$/.test(p.key));

  sql = sql.replace(/(^|[^\\])\?/g, (_, prefix) => {
    const param = positionalParams[positionalIndex++];
    if (!param) {
      error = `Missing value for positional parameter at index ${positionalIndex - 1}`;
      return `${prefix}?`;
    }
    return `${prefix}${detectTypeAndEscape(param.value)}`;
  });

  // Unescape escaped question marks
  sql = sql.replace(/\\\?/g, '?');

  return { sql: error ? '' : sql, error };
}
