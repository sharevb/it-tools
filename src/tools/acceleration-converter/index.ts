import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.acceleration-converter.title'),
  path: '/acceleration-converter',
  description: t('tools.acceleration-converter.description'),
  keywords: ['acceleration', 'converter',
    'units', 'g (g-force)', 'm/s2',
  ],
  component: () => import('./acceleration-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Run')),
  createdAt: new Date('2026-01-30'),
  category: 'Physics',
});
