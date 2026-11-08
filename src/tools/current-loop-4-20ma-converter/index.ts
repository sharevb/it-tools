import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.current-loop-4-20ma-converter.title'),
  path: '/current-loop-4-20ma-converter',
  description: t('tools.current-loop-4-20ma-converter.description'),
  keywords: [
    '4-20',
    'ma',
    'milliampere',
    'current',
    'loop',
    'analog',
    'sensor',
    'transmitter',
    'namur',
    'ne43',
    'plc',
    'scaling',
  ],
  component: () => import('./current-loop-4-20ma-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Gauge')),
  createdAt: new Date('2026-11-03'),
  category: 'Automation',
});
