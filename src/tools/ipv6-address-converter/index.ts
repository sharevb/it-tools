import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ipv6-address-converter.title'),
  path: '/ipv6-address-converter',
  description: t('tools.ipv6-address-converter.description'),
  keywords: ['ipv6', 'address', 'converter', 'decimal', 'hexadecimal', 'binary', 'ipv4'],
  component: () => import('./ipv6-address-converter.vue'),
  icon: Binary,
  createdAt: new Date('2024-01-10'),
  category: 'Network',
});
