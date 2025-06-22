import { BrandHtml5 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.html-prettifier.title'),
  path: '/html-prettifier',
  description: translate('tools.html-prettifier.description'),
  keywords: ['html', 'prettifier', 'beautify', 'prettier', 'format'],
  component: () => import('./html-prettifier.vue'),
  icon: BrandHtml5,
  createdAt: new Date('2024-03-15'),
  category: 'Web',
});
