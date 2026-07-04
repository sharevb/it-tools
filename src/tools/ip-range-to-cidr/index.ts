import { Binary } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.ip-range-to-cidr.title'),
  path: '/ip-range-to-cidr',
  description: t('tools.ip-range-to-cidr.description'),
  keywords: ['ip', 'range', 'to', 'cidr'],
  component: () => import('./ip-range-to-cidr.vue'),
  icon: Binary,
  createdAt: new Date('2024-01-10'),
  category: 'Network',
});
