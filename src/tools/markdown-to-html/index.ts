import { Markdown } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.markdown-to-html.title'),
  path: '/markdown-to-html',
  description: t('tools.markdown-to-html.description'),
  keywords: ['markdown', 'html', 'converter', 'pdf'],
  component: () => import('./markdown-to-html.vue'),
  icon: Markdown,
  createdAt: new Date('2024-08-25'),
  category: 'Markdown',
});
