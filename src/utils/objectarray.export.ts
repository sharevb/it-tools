import yaml from 'yaml';
import convert from 'xml-js';
import { nestifyObject } from 'nestify-anything';

export type ExportFormat = 'json' | 'yaml' | 'sql' | 'csv' | 'tsv' | 'csv_semicolon' | 'markdown' | 'xml';

function escapeSQL(value: any) {
  return typeof value === 'string' ? `'${value.replace(/'/g, '\'\'')}'` : value;
}

function escapeCSV(value: any) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function escapeMarkdown(value: any) {
  return String(value).replace(/\|/g, '\\|').replace(/`/g, '\\`');
}

export function objectArrayToData(data: any[], format: ExportFormat, options: {
  nestify?: boolean
  tableName?: string
} = {}) {
  const dataPrepared = options.nestify ? data.map(obj => nestifyObject(obj)) : data;
  switch (format) {
    case 'json':
      return JSON.stringify(dataPrepared, null, 2);
    case 'yaml':
      return yaml.stringify(dataPrepared);
    case 'sql':
      return dataPrepared.map((row) => {
        const keys = Object.keys(row).map(k => k?.replace(/\s/g, '')).join(', ');
        const values = Object.values(row).map(escapeSQL).join(', ');
        return `INSERT INTO ${(options.tableName ?? 'MyTable')} (${keys}) VALUES (${values});`;
      }).join('\n');
    case 'csv':
    case 'tsv':
    case 'csv_semicolon':
      // eslint-disable-next-line no-case-declarations
      let sep = ',';
      if (format === 'tsv') {
        sep = '\t';
      }
      else if (format === 'csv_semicolon') {
        sep = ';';
      }
      return [
        Object.keys(dataPrepared[0]).map(escapeCSV).join(sep),
        ...dataPrepared.map(row => Object.values(row).map(escapeCSV).join(sep)),
      ].join('\n');
    case 'markdown':
      return `| ${Object.keys(dataPrepared[0]).map(escapeMarkdown).join(' | ')} |\n| ${Object.keys(dataPrepared[0]).map(() => '---').join(' | ')} |\n${
        dataPrepared.map(row => `| ${Object.values(row).map(escapeMarkdown).join(' | ')} |`).join('\n')}`;
    case 'xml':
      return convert.js2xml({ root: dataPrepared }, { compact: true });
    default:
      return '';
  }
}
