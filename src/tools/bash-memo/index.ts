import { Command } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Bash Cheatsheet',
  path: '/bash-memo',
  description: 'Bash common commands',
  keywords: ['bash', 'shell'],
  component: () => import('./bash-memo.vue'),
  icon: Command,
  createdAt: new Date('2025-05-08'),
  category: 'Cheatsheets',
});
