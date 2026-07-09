import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.xml-formatter.title'),
  path: '/xml-formatter',
  description: t('tools.xml-formatter.description'),
  keywords: ['xml', 'prettify', 'format'],
  component: () => import('./xml-formatter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Code')),
  createdAt: new Date('2023-06-17'),
  npmPackages: ['xml-formatter'],
  category: 'XML',
});
