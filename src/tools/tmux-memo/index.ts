import { ScreenShare } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.tmux-memo.title'),
  path: '/tmux-memo',
  description: t('tools.tmux-memo.description'),
  keywords: ['terminal', 'linux', 'shell', 'tmux'],
  component: () => import('./tmux-memo.vue'),
  icon: ScreenShare,
  createdAt: new Date('2025-12-13'),
  category: 'Cheatsheets',
});
