import { Command } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.bash-memo.title'),
  path: '/bash-memo',
  description: t('tools.bash-memo.description'),
  keywords: ['bash', 'shell'],
  component: () => import('./bash-memo.vue'),
  icon: Command,
  createdAt: new Date('2025-05-08'),
  category: 'Cheatsheets',
});
