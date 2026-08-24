import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.regex-memo.title'),
  path: '/regex-memo',
  description: t('tools.regex-memo.description'),
  keywords: ['regex', 'regular', 'expression', 'javascript', 'memo', 'cheatsheet'],
  component: () => import('./regex-memo.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/BrandJavascript')),
  createdAt: new Date('2024-09-20'),
  category: 'Cheatsheets',
});
