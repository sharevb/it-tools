import { getUnicodeNames } from '@li/unicode-names';

export const DATA_FILE_NAME = 'unicode-16.0.0-names.json.gz';

export async function initUnicodeNames(data: Promise<Uint8Array | Response>) {
  const unicodeNames = await getUnicodeNames(data);

  return function convertTextToUnicodeNames(text: string, { separator = ' ' }: { separator?: string } = {}): string {
    return [...text]
      .map((ch) => {
        const cp = ch.codePointAt(0)!;
        const hex = `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
        const name = unicodeNames.getByCodePoint(cp) ?? 'UNKNOWN CHARACTER';
        return `${ch} (${hex}: ${name})`;
      })
      .join(separator);
  };
}
