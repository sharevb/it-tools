import { translate as t } from '@/plugins/i18n.plugin';
import { WorldLatitude } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.rj45-memo.title'),
  path: '/rj45-memo',
  description: t('tools.rj45-memo.description'),
  keywords: ['rj45', 'cat6', 'wiring', 'cheatsheet', 'memo'],
  component: () => import('./rj45-memo.vue'),
  icon: WorldLatitude,
  createdAt: new Date('2026-01-24'),
  category: 'Forensic',
});
