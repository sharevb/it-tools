import { WorldLatitude } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'RJ45 Cat6 Wiring Cheatsheet',
  path: '/rj45-memo',
  description: 'Complete RJ45 Cat6 Wiring cheatsheet',
  keywords: ['rj45', 'cat6', 'wiring', 'cheatsheet', 'memo'],
  component: () => import('./rj45-memo.vue'),
  icon: WorldLatitude,
  createdAt: new Date('2026-01-24'),
  category: 'Forensic',
});
