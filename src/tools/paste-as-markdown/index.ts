import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.paste-as-markdown.title'),
  path: '/paste-as-markdown',
  description: t('tools.paste-as-markdown.description'),
  keywords: ['paste', 'cell', 'table', 'links', 'md', 'markdown'],
  component: () => import('./paste-as-markdown.vue'),
  icon: Markdown,
  createdAt: new Date('2024-07-14'),
  category: 'Markdown',
});
