import { PlugConnected } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.port-numbers.title'),
  path: '/port-numbers',
  description: t('tools.port-numbers.description'),
  keywords: ['port', 'tcp', 'udp', 'protocol'],
  component: () => import('./port-numbers.vue'),
  icon: PlugConnected,
  createdAt: new Date('2024-04-20'),
  category: 'Network',
});
