import { RouterOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ipv4-subnets-list.title'),
  path: '/ipv4-subnets-list',
  description: t('tools.ipv4-subnets-list.description'),
  keywords: ['ipv4', 'subnet', 'bitmask'],
  component: () => import('./ipv4-subnets-list.vue'),
  icon: RouterOutlined,
  createdAt: new Date('2025-12-06'),
  category: 'Network',
});
