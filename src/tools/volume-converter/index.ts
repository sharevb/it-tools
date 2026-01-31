import { translate as t } from '@/plugins/i18n.plugin';
import { IconMeterCube } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.volume-converter.title'),
  path: '/volume-converter',
  description: t('tools.volume-converter.description'),
  keywords: ['volume', 'converter',
    'units', 'meter', 'stere', 'cubic', 'liter', 'barrel', 'gallon', 'pint', 'ounce', 'quart', 'm3',
  ],
  component: () => import('./volume-converter.vue'),
  icon: IconMeterCube,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
