import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ip-range-to-cidr.title'),
  path: '/ip-range-to-cidr',
  description: translate('tools.ip-range-to-cidr.description'),
  keywords: ['ip', 'range', 'to', 'cidr'],
  component: () => import('./ip-range-to-cidr.vue'),
  icon: Binary,
  createdAt: new Date('2024-01-10'),
  category: 'Network',
});
