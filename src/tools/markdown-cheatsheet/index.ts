import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

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
