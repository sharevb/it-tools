import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.integers-to-ip.title'),
  path: '/integers-to-ip',
  description: translate('tools.integers-to-ip.description'),
  keywords: ['integers', 'ip', 'ipv4', 'ipv6'],
  component: () => import('./integers-to-ip.vue'),
  icon: Binary,
  createdAt: new Date('2024-07-14'),
  category: 'Network',
});
