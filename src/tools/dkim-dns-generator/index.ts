import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.dkim-dns-generator.title'),
  path: '/dkim-dns-generator',
  description: translate('tools.dkim-dns-generator.description'),
  keywords: ['dkim', 'dns'],
  component: () => import('./dkim-dns-generator.vue'),
  icon: World,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
