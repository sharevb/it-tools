import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.powershell-memo.title'),
  path: '/powershell-memo',
  description: t('tools.powershell-memo.description'),
  keywords: ['powershell', 'memo', 'cheatsheet', 'shell'],
  component: () => import('./powershell-memo.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Command')),
  createdAt: new Date('2026-05-11'),
  category: 'Cheatsheets',
});
