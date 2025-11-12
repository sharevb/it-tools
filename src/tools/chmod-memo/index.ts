import { FileInvoice } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'chmod Command Cheatsheet',
  path: '/chmod-memo',
  description: 'Cheatsheets for Linux permissions changes',
  keywords: ['chmod', 'permissions', 'memo', 'cheatsheet'],
  component: () => import('./chmod-memo.vue'),
  icon: FileInvoice,
  createdAt: new Date('2025-11-11'),
  category: 'Cheatsheets',
});
