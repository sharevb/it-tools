import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.markdown-lorem-ipsum.title'),
  path: '/markdown-lorem-ipsum',
  description: t('tools.markdown-lorem-ipsum.description'),
  keywords: ['markdown', 'lorem', 'ipsum'],
  component: () => import('./markdown-lorem-ipsum.vue'),
  icon: AlignJustified,
  createdAt: new Date('2025-11-29'),
  category: 'Markdown',
});
