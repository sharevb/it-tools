import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.text-statistics.title'),
  path: '/text-statistics',
  description: t('tools.text-statistics.description'),
  keywords: ['text', 'statistics', 'length', 'characters', 'count', 'size', 'bytes'],
  component: () => import('./text-statistics.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileText')),
  redirectFrom: ['/text-stats'],
  category: 'Text',
});
