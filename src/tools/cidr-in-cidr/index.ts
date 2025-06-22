import { UnfoldMoreOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.cidr-in-cidr.title'),
  path: '/cidr-in-cidr',
  description: translate('tools.cidr-in-cidr.description'),
  keywords: ['ip', 'cidr', 'range', 'mask', 'wildcard', 'ipv4', 'ipv6', 'subnet', 'include', 'inclusion'],
  component: () => import('./cidr-in-cidr.vue'),
  redirectFrom: ['/ip-in-range'],
  icon: UnfoldMoreOutlined,
  createdAt: new Date('2025-01-12'),
  category: 'Network',
});
