import { Calculator } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.many-units-converter.title'),
  path: '/many-units-converter',
  description: t('tools.many-units-converter.description'),
  keywords: [
    'units',
    'uom',
    'metric',
    'imperial',
    'measurement',
    'mass',
    'weight',
    'angle',
    'area',
    'data',
    'energy',
    'force',
    'length',
    'mass',
    'power',
    'pressure',
    'temperature',
    'time',
    'volume',
    'converter',
  ],
  component: () => import('./many-units-converter.vue'),
  icon: Calculator,
  createdAt: new Date('2024-08-15'),
  category: 'Converters',
});
