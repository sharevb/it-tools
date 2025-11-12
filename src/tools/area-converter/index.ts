import { SquaresDiagonal } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.area-converter.title'),
  path: '/area-converter',
  description: t('tools.area-converter.description'),
  keywords: ['area', 'converter',
    'units', 'square meter', 'are', 'square',
  ],
  component: () => import('./area-converter.vue'),
  icon: SquaresDiagonal,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
