import { PlugConnected } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.port-numbers.title'),
  path: '/port-numbers',
  description: translate('tools.port-numbers.description'),
  keywords: ['port', 'tcp', 'udp', 'protocol'],
  component: () => import('./port-numbers.vue'),
  icon: PlugConnected,
  createdAt: new Date('2024-04-20'),
  category: 'Network',
});
