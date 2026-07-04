import { FileSearch } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.url-text-fragment-maker.title'),
  path: '/url-text-fragment-maker',
  description: t('tools.url-text-fragment-maker.description'),
  keywords: ['url', 'text', 'fragment'],
  component: () => import('./url-text-fragment-maker.vue'),
  icon: FileSearch,
  createdAt: new Date('2024-01-17'),
  category: 'Web',
});
