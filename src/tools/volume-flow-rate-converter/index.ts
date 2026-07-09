import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.volume-flow-rate-converter.title'),
  path: '/volume-flow-rate-converter',
  description: t('tools.volume-flow-rate-converter.description'),
  keywords: ['volume', 'flow', 'rate', 'converter',
    'units', 'm3/s', 'l/s', 'tsp/s', 'in3/s', 'fl-oz/s', 'gal/s', 'ft3/s', 'yd3/s',
  ],
  component: () => import('./volume-flow-rate-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Wind')),
  createdAt: new Date('2026-01-30'),
  category: 'Physics',
});
