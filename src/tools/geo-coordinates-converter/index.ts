import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.geo-coordinates-converter.title'),
  path: '/geo-coordinates-converter',
  description: t('tools.geo-coordinates-converter.description'),
  keywords: ['geo', 'latitude', 'longitude', 'coordinates', 'converter'],
  component: () => import('./geo-coordinates-converter.vue'),
  icon: World,
  createdAt: new Date('2026-01-09'),
  category: 'Converters',
});
