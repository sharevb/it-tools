import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.dmarc-dns-generator.title'),
  path: '/dmarc-dns-generator',
  description: translate('tools.dmarc-dns-generator.description'),
  keywords: ['dmarc', 'dns'],
  component: () => import('./dmarc-dns-generator.vue'),
  icon: World,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
