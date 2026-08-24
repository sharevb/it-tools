import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.jsonpath-memo.title'),
  path: '/jsonpath-memo',
  description: t('tools.jsonpath-memo.description'),
  keywords: ['jsonpath', 'cheatsheet', 'memo'],
  component: () => import('./jsonpath-memo.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Braces')),
  createdAt: new Date('2024-08-15'),
  category: 'Cheatsheets',
});
