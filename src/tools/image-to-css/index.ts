import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.image-to-css.title'),
  path: '/image-to-css',
  description: t('tools.image-to-css.description'),
  keywords: ['image', 'css'],
  component: () => import('./image-to-css.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/BrandCss3')),
  createdAt: new Date('2024-05-11'),
  category: 'Web',
});
