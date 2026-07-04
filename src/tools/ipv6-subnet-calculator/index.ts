import { RouterOutlined } from '@vicons/material';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.ipv6-subnet-calculator.title'),
  path: '/ipv6-subnet-calculator',
  description: t('tools.ipv6-subnet-calculator.description'),
  keywords: ['ipv6', 'subnet', 'calculator', 'mask', 'network', 'cidr', 'netmask', 'bitmask', 'broadcast', 'address'],
  component: () => import('./ipv6-subnet-calculator.vue'),
  icon: RouterOutlined,
  createdAt: new Date('2024-02-25'),
  category: 'Network',
});
