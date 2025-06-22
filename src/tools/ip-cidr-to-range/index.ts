import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ip-cidr-to-range.title'),
  path: '/ip-cidr-to-range',
  description: translate('tools.ip-cidr-to-range.description'),
  keywords: ['ipv4', 'ipv6', 'cidr'],
  component: () => import('./ip-cidr-to-range.vue'),
  icon: Binary,
  createdAt: new Date('2024-01-10'),
  category: 'Network',
});
