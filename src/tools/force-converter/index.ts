import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.force-converter.title'),
  path: '/force-converter',
  description: t('tools.force-converter.description'),
  keywords: ['force', 'converter',
    'units', 'newton', 'dyne', 'pond', 'ton-force',
  ],
  component: () => import('./force-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Barbell')),
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
