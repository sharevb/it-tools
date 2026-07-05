import { translate as t } from '@/plugins/i18n.plugin';
import { Run } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.acceleration-converter.title'),
  path: '/acceleration-converter',
  description: t('tools.acceleration-converter.description'),
  keywords: ['acceleration', 'converter',
    'units', 'g (g-force)', 'm/s2',
  ],
  component: () => import('./acceleration-converter.vue'),
  icon: Run,
  createdAt: new Date('2026-01-30'),
  category: 'Physics',
});
