import { FileSearch } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

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
