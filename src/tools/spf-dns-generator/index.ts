import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.spf-dns-generator.title'),
  path: '/spf-dns-generator',
  description: translate('tools.spf-dns-generator.description'),
  keywords: ['spf', 'dns'],
  component: () => import('./spf-dns-generator.vue'),
  icon: World,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
