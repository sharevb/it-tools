import { Markdown } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.markdown-cheatsheet.title'),
  path: '/markdown-cheatsheet',
  description: t('tools.markdown-cheatsheet.description'),
  keywords: ['markdown', 'cheatsheet', 'memo'],
  component: () => import('./markdown-cheatsheet.vue'),
  icon: Markdown,
  createdAt: new Date('2024-03-09'),
  category: 'Cheatsheets',
});
