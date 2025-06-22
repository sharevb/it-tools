import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ip-geo-location.title'),
  path: '/ip-geo-location',
  description: translate('tools.ip-geo-location.description'),
  keywords: ['ip', 'domain', 'geo', 'location'],
  component: () => import('./ip-geo-location.vue'),
  icon: World,
  createdAt: new Date('2024-01-17'),
  category: 'Network',
});
