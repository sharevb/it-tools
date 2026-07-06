import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.html-minifier.title'),
  path: '/html-minifier',
  description: t('tools.html-minifier.description'),
  keywords: ['html', 'minifier'],
  component: () => import('./html-minifier.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/BrandHtml5')),
  createdAt: new Date('2025-07-06'),
  category: 'Web',
});
