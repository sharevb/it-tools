import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.dns-queries.title'),
  path: '/dns-queries',
  description: translate('tools.dns-queries.description'),
  keywords: ['dns', 'nslookup', 'queries'],
  component: () => import('./dns-queries.vue'),
  icon: World,
  createdAt: new Date('2024-08-15'),
  category: 'Network',
});
