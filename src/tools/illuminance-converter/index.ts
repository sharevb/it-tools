import { Brightness2 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.illuminance-converter.title'),
  path: '/illuminance-converter',
  description: translate('tools.illuminance-converter.description'),
  keywords: ['illuminance', 'converter', 'lux', 'lx', 'foot', 'candles', 'fc', 'flame', 'nox', 'phot'],
  component: () => import('./illuminance-converter.vue'),
  icon: Brightness2,
  createdAt: new Date('2025-02-09'),
  category: 'Physics',
});
