import { BrandCss3 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.css-prettifier.title'),
  path: '/css-prettifier',
  description: translate('tools.css-prettifier.description'),
  keywords: ['css', 'prettifier', 'beautify', 'prettier', 'format'],
  component: () => import('./css-prettifier.vue'),
  icon: BrandCss3,
  createdAt: new Date('2024-03-15'),
  category: 'Web',
});
