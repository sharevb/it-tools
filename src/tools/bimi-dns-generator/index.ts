import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.bimi-dns-generator.title'),
  path: '/bimi-dns-generator',
  description: translate('tools.bimi-dns-generator.description'),
  keywords: ['bimi', 'dns', 'txt'],
  component: () => import('./bimi-dns-generator.vue'),
  icon: World,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
