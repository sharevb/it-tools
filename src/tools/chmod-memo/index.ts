import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.chmod-memo.title'),
  path: '/chmod-memo',
  description: t('tools.chmod-memo.description'),
  keywords: ['chmod', 'permissions', 'memo', 'cheatsheet'],
  component: () => import('./chmod-memo.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileInvoice')),
  createdAt: new Date('2025-11-11'),
  category: 'Cheatsheets',
});
