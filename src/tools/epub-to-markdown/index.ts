import { translate as t } from '@/plugins/i18n.plugin';
import { Book2 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.epub-to-markdown.title'),
  path: '/epub-to-markdown',
  description: t('tools.epub-to-markdown.description'),
  keywords: ['epub', 'markdown'],
  component: () => import('./epub-to-markdown.vue'),
  icon: Book2,
  createdAt: new Date('2026-02-01'),
  category: 'Markdown',
});
