import { AlignJustified } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.yaml-prettify.title'),
  path: '/yaml-prettify',
  description: t('tools.yaml-prettify.description'),
  keywords: ['yaml', 'viewer', 'prettify', 'format', 'lint', 'validator', 'schema'],
  component: () => import('./yaml-viewer.vue'),
  icon: AlignJustified,
  createdAt: new Date('2024-01-31'),
  npmPackages: ['yaml'],
  category: 'YAML',
});
