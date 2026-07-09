import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ipv6-subnet-calculator.title'),
  path: '/ipv6-subnet-calculator',
  description: t('tools.ipv6-subnet-calculator.description'),
  keywords: ['ipv6', 'subnet', 'calculator', 'mask', 'network', 'cidr', 'netmask', 'bitmask', 'broadcast', 'address'],
  component: () => import('./ipv6-subnet-calculator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/material/es/RouterOutlined')),
  createdAt: new Date('2024-02-25'),
  category: 'Network',
});
