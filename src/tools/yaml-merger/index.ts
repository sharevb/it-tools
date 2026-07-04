import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.yaml-merger.title'),
  path: '/yaml-merger',
  description: t('tools.yaml-merger.description'),
  keywords: ['yaml', 'merger'],
  component: () => import('./yaml-merger.vue'),
  icon: AlignJustified,
  createdAt: new Date('2025-07-19'),
  npmPackages: ['yaml'],
  category: 'YAML',
});
