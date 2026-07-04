import { Markdown } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.markdown-to-docx.title'),
  path: '/markdown-to-docx',
  description: t('tools.markdown-to-docx.description'),
  keywords: ['markdown', 'word', 'docx'],
  component: () => import('./markdown-to-docx.vue'),
  icon: Markdown,
  createdAt: new Date('2025-08-15'),
  category: 'Markdown',
});
