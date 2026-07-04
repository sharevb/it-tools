import { BrandCss3 } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.css-selectors-memo.title'),
  path: '/css-selectors-memo',
  description: t('tools.css-selectors-memo.description'),
  keywords: ['css', 'selectors', 'cheatsheet', 'memo'],
  component: () => import('./css-selectors-memo.vue'),
  icon: BrandCss3,
  createdAt: new Date('2024-08-15'),
  category: 'Cheatsheets',
});
