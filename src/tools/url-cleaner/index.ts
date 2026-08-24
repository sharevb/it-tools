import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.url-cleaner.title'),
  path: '/url-cleaner',
  description: t('tools.url-cleaner.description'),
  keywords: ['url', 'cleaner', 'utm', 'fbclip'],
  component: () => import('./url-cleaner.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/ClearAll')),
  createdAt: new Date('2024-03-13'),
  category: 'Web',
});
