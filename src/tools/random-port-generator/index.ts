import { Server } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.random-port-generator.title'),
  path: '/random-port-generator',
  description: t('tools.random-port-generator.description'),
  keywords: ['system', 'port', 'lan', 'generator', 'random', 'development', 'computer'],
  component: () => import('./random-port-generator.vue'),
  icon: Server,
  category: 'Network',
});
