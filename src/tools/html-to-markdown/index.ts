import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.html-to-markdown.title'),
  path: '/html-to-markdown',
  description: t('tools.html-to-markdown.description'),
  keywords: ['html', 'markdown', 'converter'],
  component: () => import('./html-to-markdown.vue'),
  icon: Markdown,
  createdAt: new Date('2024-01-17'),
  category: 'Markdown',
});
