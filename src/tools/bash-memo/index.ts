import { Command } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.bash-memo.title'),
  path: '/bash-memo',
  description: translate('tools.bash-memo.description'),
  keywords: ['bash', 'shell'],
  component: () => import('./bash-memo.vue'),
  icon: Command,
  createdAt: new Date('2025-05-08'),
  category: 'Cheatsheets',
});
