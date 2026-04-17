import JSON5 from 'json5';

export { convertJsonToEnv };

function serializeValue(value: unknown): { value: string; forceQuote: boolean } {
  if (value === null || value === undefined) {
    return { value: '', forceQuote: true };
  }

  if (typeof value === 'object') {
    return { value: JSON.stringify(value), forceQuote: true };
  }

  return { value: String(value), forceQuote: false };
}

function formatEnvValue({ value, forceQuote }: { value: string; forceQuote: boolean }): string {
  const needsQuoting = forceQuote || value === '' || /[\s"'#`$\\]/.test(value);

  if (!needsQuoting) {
    return value;
  }

  const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
  return `"${escaped}"`;
}

function convertJsonToEnv({ json, uppercaseKeys = true }: { json: string; uppercaseKeys?: boolean }): string {
  const trimmed = json.trim();

  if (trimmed === '') {
    return '';
  }

  const parsed = JSON5.parse(trimmed);

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new TypeError('JSON must be an object, not an array or primitive.');
  }

  return Object.entries(parsed)
    .map(([key, value]) => {
      const envKey = uppercaseKeys ? key.toUpperCase() : key;
      const envValue = formatEnvValue(serializeValue(value));

      return `${envKey}=${envValue}`;
    })
    .join('\n');
}
