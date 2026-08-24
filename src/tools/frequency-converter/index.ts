import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.frequency-converter.title'),
  path: '/frequency-converter',
  description: t('tools.frequency-converter.description'),
  keywords: ['frequency', 'converter',
    'units', 'hz', 'hertz', 'rpm', 'deg/s', 'rad/s',
  ],
  component: () => import('./frequency-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/AntennaBars4')),
  createdAt: new Date('2026-01-30'),
  category: 'Physics',
});
