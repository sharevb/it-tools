import { translate as t } from '@/plugins/i18n.plugin';
import { Speedboat } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.speed-converter.title'),
  path: '/speed-converter',
  description: t('tools.speed-converter.description'),
  keywords: ['speed', 'converter',
    'units', 'm/s', 'km/h', 'm/h', 'knot', 'ft/s',
  ],
  component: () => import('./speed-converter.vue'),
  icon: Speedboat,
  createdAt: new Date('2026-01-30'),
  category: 'Physics',
});
