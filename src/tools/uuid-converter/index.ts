import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.uuid-converter.title'),
  path: '/uuid-converter',
  description: t('tools.uuid-converter.description'),
  keywords: ['uuid', 'converter', 'guid', 'sql'],
  component: () => import('./uuid-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Replace')),
  createdAt: new Date('2023-11-08'),
  category: 'Generators',
});
