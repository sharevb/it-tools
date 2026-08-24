import { JsonLayout, MarkdownTable2Json } from 'mdt2json';
import { translate as t } from '@/plugins/i18n.plugin';

export type MarkdownTableAlignment = 'left' | 'center' | 'right';

export interface MarkdownTable {
  headers: string[];
  alignments: MarkdownTableAlignment[];
  rows: string[][];
}

const alignmentSeparators: Record<MarkdownTableAlignment, string> = {
  left: ':---',
  center: ':---:',
  right: '---:',
};

export function pasteMarkdownTable(markdownContent: string): MarkdownTable | null {
  const transpiler = new MarkdownTable2Json({
    markdownString: markdownContent.replace(/<!--[\s\S]*?-->/g, ' '), // Remove HTML comments
    layout: JsonLayout.AoS,
    minify: true,
  });
  const output_markdown = transpiler.transform();
  if ([...(output_markdown?.match(/```json/g) || [])].length > 1) {
    throw new Error(t('tools.html-to-data.texts.error-multiple-json-blocks'));
  }
  const output_first_codeblock = output_markdown?.match(/```json\n(.*?)\n```/s)?.[1] || '[]';
  const data = JSON.parse(output_first_codeblock);
  return {
    headers: Object.keys(data[0] || {}),
    alignments: Object.keys(data[0] || {}).map(() => 'left'),
    rows: data.map((row: Record<string, string>) => Object.values(row)),
  };
}

export function createMarkdownTable({
  rows = 2,
  columns = 3,
}: { rows?: number; columns?: number } = {}): MarkdownTable {
  return {
    headers: Array.from({ length: columns }, (_, index) => `Column ${index + 1}`),
    alignments: Array.from({ length: columns }, () => 'left'),
    rows: Array.from({ length: rows }, () => Array.from({ length: columns }, () => '')),
  };
}

export function escapeMarkdownTableCell(value: string): string {
  return value
    .replace(/\|/g, '\\|')
    .replace(/\r\n|\r|\n/g, '<br>')
    .trim();
}

function getColumnCount(table: MarkdownTable): number {
  return Math.max(table.headers.length, table.alignments.length, ...table.rows.map((row) => row.length));
}

function getCells(cells: string[], columns: number): string[] {
  return Array.from({ length: columns }, (_, index) => escapeMarkdownTableCell(cells[index] ?? ''));
}

function formatRow(cells: string[]): string {
  return `| ${cells.join(' | ')} |`;
}

export function generateMarkdownTable(table: MarkdownTable): string {
  const columns = getColumnCount(table);

  if (columns === 0) {
    return '';
  }

  const headers = getCells(table.headers, columns);
  const separators = Array.from(
    { length: columns },
    (_, index) => alignmentSeparators[table.alignments[index] ?? 'left'],
  );
  const rows = table.rows.map((row) => formatRow(getCells(row, columns)));

  return [formatRow(headers), formatRow(separators), ...rows].join('\n');
}
