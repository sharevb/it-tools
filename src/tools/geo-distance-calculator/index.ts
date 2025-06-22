import { WorldLatitude } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.geo-distance-calculator.title'),
  path: '/geo-distance-calculator',
  description: translate('tools.geo-distance-calculator.description'),
  keywords: ['geo', 'distance', 'calculator'],
  component: () => import('./geo-distance-calculator.vue'),
  icon: WorldLatitude,
  createdAt: new Date('2025-01-01'),
  category: 'Measurement',
});
