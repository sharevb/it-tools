import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.html-cleaner.title'),
  path: '/html-cleaner',
  description: t('tools.html-cleaner.description'),
  keywords: ['html', 'cleaner'],
  component: () => import('./html-cleaner.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/BrandHtml5')),
  createdAt: new Date('2024-02-25'),
  category: 'Web',
});
