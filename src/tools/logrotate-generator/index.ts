import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.logrotate-generator.title'),
  path: '/logrotate-generator',
  description: t('tools.logrotate-generator.description'),
  keywords: ['logrotate', 'apache', 'generator'],
  component: () => import('./logrotate-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileExport')),
  createdAt: new Date('2025-05-08'),
  category: 'Network',
});
