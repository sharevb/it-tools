import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.markdown-preview.title'),
  path: '/markdown-preview',
  description: t('tools.markdown-preview.description'),
  keywords: ['markdown', 'preview'],
  component: () => import('./markdown-preview.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Markdown')),
  createdAt: new Date('2026-03-17'),
  category: 'Markdown',
});
