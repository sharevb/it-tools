import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.jq-memo.title'),
  path: '/jq-memo',
  description: t('tools.jq-memo.description'),
  keywords: ['jq', 'cheatsheet', 'memo'],
  component: () => import('./jq-memo.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Braces')),
  createdAt: new Date('2024-08-15'),
  category: 'Cheatsheets',
});
