import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.shell-linearizer.title'),
  path: '/shell-linearizer',
  description: t('tools.shell-linearizer.description'),
  keywords: ['shell', 'multiline', 'linearizer'],
  component: () => import('./shell-linearizer.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Terminal2')),
  createdAt: new Date('2026-02-14'),
  category: 'Network',
});
