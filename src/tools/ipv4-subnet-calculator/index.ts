import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ipv4-subnet-calculator.title'),
  path: '/ipv4-subnet-calculator',
  description: t('tools.ipv4-subnet-calculator.description'),
  keywords: ['ipv4', 'subnet', 'calculator', 'mask', 'network', 'cidr', 'netmask', 'bitmask', 'broadcast', 'address'],
  component: () => import('./ipv4-subnet-calculator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/material/es/RouterOutlined')),
  category: 'Network',
});
