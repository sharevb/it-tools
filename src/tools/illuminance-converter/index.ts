import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.illuminance-converter.title'),
  path: '/illuminance-converter',
  description: t('tools.illuminance-converter.description'),
  keywords: [
    'illuminance',
    'converter',
    'lux', 'lx',
    'foot', 'candles', 'fc', 'flame',
    'nox', 'phot', 'units'],
  component: () => import('./illuminance-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Sun')),
  createdAt: new Date('2025-02-09'),
  category: 'Physics',
});
