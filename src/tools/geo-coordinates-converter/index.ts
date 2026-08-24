import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.geo-coordinates-converter.title'),
  path: '/geo-coordinates-converter',
  description: t('tools.geo-coordinates-converter.description'),
  keywords: ['geo', 'latitude', 'longitude', 'coordinates', 'converter'],
  component: () => import('./geo-coordinates-converter.vue'),
  icon: defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconWorldPin.mjs')),
  createdAt: new Date('2026-01-09'),
  category: 'Converters',
  externAccessDescription: 'This tool access OpenStreetMap to display the World map using the Leaflet library.',
});
