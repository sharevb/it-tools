import { FileSearch } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.url-text-fragment-maker.title'),
  path: '/url-text-fragment-maker',
  description: translate('tools.url-text-fragment-maker.description'),
  keywords: ['url', 'text', 'fragment'],
  component: () => import('./url-text-fragment-maker.vue'),
  icon: FileSearch,
  createdAt: new Date('2024-01-17'),
  category: 'Web',
});
