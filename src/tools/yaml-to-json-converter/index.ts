import { AlignJustified } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.yaml-to-json-converter.title'),
  path: '/yaml-to-json-converter',
  description: t('tools.yaml-to-json-converter.description'),
  keywords: ['yaml', 'to', 'json'],
  component: () => import('./yaml-to-json.vue'),
  icon: AlignJustified,
  createdAt: new Date('2023-04-10'),
  npmPackages: ['yaml'],
  category: 'YAML',
});
