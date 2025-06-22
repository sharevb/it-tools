import { Brackets } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.jsonpath-memo.title'),
  path: '/jsonpath-memo',
  description: translate('tools.jsonpath-memo.description'),
  keywords: ['jsonpath', 'cheatsheet', 'memo'],
  component: () => import('./jsonpath-memo.vue'),
  icon: Brackets,
  createdAt: new Date('2024-08-15'),
  category: 'Cheatsheets',
});
