import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-flatten-nestify.title'),
  path: '/json-flatten-nestify',
  description: t('tools.json-flatten-nestify.description'),
  keywords: ['json', 'flatten', 'nestify', 'unflatten'],
  component: () => import('./json-flatten-nestify.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Braces')),
  createdAt: new Date('2025-07-19'),
  category: 'JSON',
});
