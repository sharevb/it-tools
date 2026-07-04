import { BrandHtml5 } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.html-prettifier.title'),
  path: '/html-prettifier',
  description: t('tools.html-prettifier.description'),
  keywords: ['html', 'prettifier', 'beautify', 'prettier', 'format'],
  component: () => import('./html-prettifier.vue'),
  icon: BrandHtml5,
  createdAt: new Date('2024-03-15'),
  category: 'Web',
});
