import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.cron-expression-builder.title'),
  path: '/cron-expression-builder',
  description: t('tools.cron-expression-builder.description'),
  keywords: ['cron', 'expression', 'builder'],
  component: () => import('./cron-expression-builder.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Clock')),
  createdAt: new Date('2026-07-11'),
  category: 'Default',
});
