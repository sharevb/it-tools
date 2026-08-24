import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.css-prettifier.title'),
  path: '/css-prettifier',
  description: t('tools.css-prettifier.description'),
  keywords: ['css', 'prettifier', 'beautify', 'prettier', 'format'],
  component: () => import('./css-prettifier.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/BrandCss3')),
  createdAt: new Date('2024-03-15'),
  category: 'Web',
});
