import { BrandCss3 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.image-to-css.title'),
  path: '/image-to-css',
  description: translate('tools.image-to-css.description'),
  keywords: ['image', 'css'],
  component: () => import('./image-to-css.vue'),
  icon: BrandCss3,
  createdAt: new Date('2024-05-11'),
  category: 'Web',
});
