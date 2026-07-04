import { AlignJustified } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.yaml-to-toml.title'),
  path: '/yaml-to-toml',
  description: t('tools.yaml-to-toml.description'),
  keywords: ['yaml', 'to', 'toml', 'convert', 'transform'],
  component: () => import('./yaml-to-toml.vue'),
  icon: AlignJustified,
  createdAt: new Date('2023-06-23'),
  npmPackages: ['yaml', 'smol-toml'],
  category: 'YAML',
});
