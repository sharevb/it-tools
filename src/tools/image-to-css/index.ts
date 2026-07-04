import { BrandCss3 } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.image-to-css.title'),
  path: '/image-to-css',
  description: t('tools.image-to-css.description'),
  keywords: ['image', 'css'],
  component: () => import('./image-to-css.vue'),
  icon: BrandCss3,
  createdAt: new Date('2024-05-11'),
  category: 'Web',
});
