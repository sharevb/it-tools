import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.markdown-diff.title'),
  path: '/markdown-diff',
  description: t('tools.markdown-diff.description'),
  keywords: ['markdown', 'diff', 'compare', 'difference', 'markdown diff', 'md', 'text'],
  component: () => import('./markdown-diff.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Markdown')),
  createdAt: new Date('2026-07-10'),
  category: 'Markdown',
});
