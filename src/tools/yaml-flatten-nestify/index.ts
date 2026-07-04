import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.yaml-flatten-nestify.title'),
  path: '/yaml-flatten-nestify',
  description: t('tools.yaml-flatten-nestify.description'),
  keywords: ['yaml', 'flatten', 'nestify', 'unflatten'],
  component: () => import('./yaml-flatten-nestify.vue'),
  icon: AlignJustified,
  createdAt: new Date('2025-07-19'),
  npmPackages: ['yaml'],
  category: 'YAML',
});
