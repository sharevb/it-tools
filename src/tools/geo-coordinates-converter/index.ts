import { translate as t } from '@/plugins/i18n.plugin';
import { IconWorldPin } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.geo-coordinates-converter.title'),
  path: '/geo-coordinates-converter',
  description: t('tools.geo-coordinates-converter.description'),
  keywords: ['geo', 'latitude', 'longitude', 'coordinates', 'converter'],
  component: () => import('./geo-coordinates-converter.vue'),
  icon: IconWorldPin,
  createdAt: new Date('2026-01-09'),
  category: 'Converters',
});
