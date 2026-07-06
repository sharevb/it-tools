import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML to data',
  path: '/html-to-data',
  description: 'Convert HTML table to JSON, YAML, CSV, SQL INSERT, XML, Markdown or XLSX',
  keywords: ['html', 'table', 'excel', 'csv', 'xlsx', 'sql', 'json', 'yaml', 'insert', 'markdown', 'md', 'tsv', 'xml'],
  component: () => import('./html-to-data.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/TableExport')),
  createdAt: new Date('2026-07-04'),
  category: 'Web',
});
