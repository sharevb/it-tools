import { Brightness2 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

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
  icon: Brightness2,
  createdAt: new Date('2025-02-09'),
  category: 'Physics',
});
