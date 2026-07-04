import { translate as t } from '@/plugins/i18n.plugin';
import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.markdown-to-text.title'),
  path: '/markdown-to-text',
  description: t('tools.markdown-to-text.description'),
  keywords: ['markdown', 'plain', 'text'],
  component: () => import('./markdown-to-text.vue'),
  icon: FileText,
  createdAt: new Date('2026-02-02'),
  category: 'Markdown',
});
