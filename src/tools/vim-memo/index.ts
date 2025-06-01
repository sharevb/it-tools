import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'VIM Cheatsheet',
  path: '/vim-memo',
  description: 'Vim text editor commands',
  keywords: ['vim', 'editor'],
  component: () => import('./vim-memo.vue'),
  icon: FileText,
  createdAt: new Date('2025-05-08'),
  category: 'Cheatsheets',
});
