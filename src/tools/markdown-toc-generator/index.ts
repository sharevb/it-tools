import { Table } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.markdown-toc-generator.title'),
  path: '/markdown-toc-generator',
  description: t('tools.markdown-toc-generator.description'),
  keywords: ['markdown', 'md', 'toc', 'generator'],
  component: () => import('./markdown-toc-generator.vue'),
  icon: Table,
  createdAt: new Date('2024-05-11'),
  category: 'Markdown',
});
