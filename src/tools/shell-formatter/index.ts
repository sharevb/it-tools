import { translate as t } from '@/plugins/i18n.plugin';
import { Terminal2 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.shell-formatter.title'),
  path: '/shell-formatter',
  description: t('tools.shell-formatter.description'),
  keywords: ['shell', 'multiline', 'formatter'],
  component: () => import('./shell-formatter.vue'),
  icon: Terminal2,
  createdAt: new Date('2026-02-14'),
  category: 'Network',
});
