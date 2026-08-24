import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.yaml-prettify.title'),
  path: '/yaml-prettify',
  description: t('tools.yaml-prettify.description'),
  keywords: ['yaml', 'viewer', 'prettify', 'format', 'lint', 'validator', 'schema'],
  component: () => import('./yaml-viewer.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/AlignJustified')),
  createdAt: new Date('2024-01-31'),
  npmPackages: ['yaml'],
  category: 'YAML',
});
