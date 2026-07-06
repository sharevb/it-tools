import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.speed-converter.title'),
  path: '/speed-converter',
  description: t('tools.speed-converter.description'),
  keywords: ['speed', 'converter',
    'units', 'm/s', 'km/h', 'm/h', 'knot', 'ft/s',
  ],
  component: () => import('./speed-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Speedboat')),
  createdAt: new Date('2026-01-30'),
  category: 'Physics',
});
