import { WorldLatitude } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.geo-distance-calculator.title'),
  path: '/geo-distance-calculator',
  description: t('tools.geo-distance-calculator.description'),
  keywords: ['geo', 'distance', 'calculator'],
  component: () => import('./geo-distance-calculator.vue'),
  icon: WorldLatitude,
  createdAt: new Date('2025-01-01'),
  category: 'Measurement',
});
