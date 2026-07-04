import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.vim-memo.title'),
  path: '/vim-memo',
  description: t('tools.vim-memo.description'),
  keywords: ['vim', 'editor'],
  component: () => import('./vim-memo.vue'),
  icon: FileText,
  createdAt: new Date('2025-05-08'),
  category: 'Cheatsheets',
});
