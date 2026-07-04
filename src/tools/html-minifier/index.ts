import { BrandHtml5 } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.html-minifier.title'),
  path: '/html-minifier',
  description: t('tools.html-minifier.description'),
  keywords: ['html', 'minifier'],
  component: () => import('./html-minifier.vue'),
  icon: BrandHtml5,
  createdAt: new Date('2025-07-06'),
  category: 'Web',
});
