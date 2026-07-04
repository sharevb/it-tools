import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.markdown-editor.title'),
  path: '/markdown-editor',
  description: t('tools.markdown-editor.description'),
  keywords: ['markdown', 'editor'],
  component: () => import('./markdown-editor.vue'),
  icon: Markdown,
  createdAt: new Date('2024-04-07'),
  category: 'Markdown',
});
