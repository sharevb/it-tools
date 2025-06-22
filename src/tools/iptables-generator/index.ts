import { Firetruck } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.iptables-generator.title'),
  path: '/iptables-generator',
  description: translate('tools.iptables-generator.description'),
  keywords: ['iptables', 'firewall'],
  component: () => import('./iptables-generator.vue'),
  icon: Firetruck,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
