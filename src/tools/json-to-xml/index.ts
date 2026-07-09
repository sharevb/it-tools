import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-to-xml.title'),
  path: '/json-to-xml',
  description: t('tools.json-to-xml.description'),
  keywords: ['json', 'xml'],
  component: () => import('./json-to-xml.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Braces')),
  createdAt: new Date('2024-06-30'),
  category: 'JSON',
});
