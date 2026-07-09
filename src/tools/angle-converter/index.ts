import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.angle-converter.title'),
  path: '/angle-converter',
  description: t('tools.angle-converter.description'),
  keywords: ['angle', 'converter',
    'units', 'degree', 'radian', 'turn', 'grad',
  ],
  component: () => import('./angle-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Angle')),
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
