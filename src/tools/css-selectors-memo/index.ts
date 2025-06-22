import { BrandCss3 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.css-selectors-memo.title'),
  path: '/css-selectors-memo',
  description: translate('tools.css-selectors-memo.description'),
  keywords: ['css', 'selectors', 'cheatsheet', 'memo'],
  component: () => import('./css-selectors-memo.vue'),
  icon: BrandCss3,
  createdAt: new Date('2024-08-15'),
  category: 'Cheatsheets',
});
