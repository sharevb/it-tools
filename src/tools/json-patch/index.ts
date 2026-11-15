import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.json-patch.title'),
  path: '/json-patch',
  description: t('tools.json-patch.description'),
  keywords: ['json', 'patch', 'rfc6902', 'path'],
  component: () => import('./json-patch.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileDiff')),
  createdAt: new Date('2026-07-05'),
  category: 'JSON',
});
