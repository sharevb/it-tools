import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.rj45-memo.title'),
  path: '/rj45-memo',
  description: t('tools.rj45-memo.description'),
  keywords: ['rj45', 'cat6', 'wiring', 'cheatsheet', 'memo'],
  component: () => import('./rj45-memo.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/WorldLatitude')),
  createdAt: new Date('2026-01-24'),
  category: 'Forensic',
});
