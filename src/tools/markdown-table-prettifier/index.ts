import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.markdown-table-prettifier.title'),
  path: '/markdown-table-prettifier',
  description: t('tools.markdown-table-prettifier.description'),
  keywords: ['markdown', 'table', 'prettifier'],
  component: () => import('./markdown-table-prettifier.vue'),
  icon: Markdown,
  createdAt: new Date('2025-08-15'),
  category: 'Markdown',
});
