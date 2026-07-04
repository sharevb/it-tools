import { translate as t } from '@/plugins/i18n.plugin';
import { Terminal2 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.shell-linearizer.title'),
  path: '/shell-linearizer',
  description: t('tools.shell-linearizer.description'),
  keywords: ['shell', 'multiline', 'linearizer'],
  component: () => import('./shell-linearizer.vue'),
  icon: Terminal2,
  createdAt: new Date('2026-02-14'),
  category: 'Network',
});
