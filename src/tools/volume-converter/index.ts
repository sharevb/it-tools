import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.volume-converter.title'),
  path: '/volume-converter',
  description: t('tools.volume-converter.description'),
  keywords: ['volume', 'converter',
    'units', 'meter', 'stere', 'cubic', 'liter', 'barrel', 'gallon', 'pint', 'ounce', 'quart', 'm3',
  ],
  component: () => import('./volume-converter.vue'),
  icon: defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconMeterCube.mjs')),
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
