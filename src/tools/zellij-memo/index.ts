import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.zellij-memo.title'),
  path: '/zellij-memo',
  description: t('tools.zellij-memo.description'),
  keywords: ['terminal', 'linux', 'shell', 'zellij'],
  component: () => import('./zellij-memo.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/ScreenShare')),
  createdAt: new Date('2025-12-17'),
  category: 'Cheatsheets',
});
