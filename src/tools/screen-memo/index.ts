import { ScreenShare } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.screen-memo.title'),
  path: '/screen-memo',
  description: t('tools.screen-memo.description'),
  keywords: ['terminal', 'linux', 'shell', 'screen'],
  component: () => import('./screen-memo.vue'),
  icon: ScreenShare,
  createdAt: new Date('2025-12-13'),
  category: 'Cheatsheets',
});
