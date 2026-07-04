import { Terminal } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.env-variables-converter.title'),
  path: '/env-variables-converter',
  description: t('tools.env-variables-converter.description'),
  keywords: ['env', 'environment', 'variables', 'yaml', 'converter'],
  component: () => import('./env-variables-converter.vue'),
  icon: Terminal,
  createdAt: new Date('2024-08-15'),
  category: 'Converters',
});
