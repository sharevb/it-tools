import { Power } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.energy-converter.title'),
  path: '/energy-converter',
  description: t('tools.energy-converter.description'),
  keywords: ['energy', 'converter',
    'units', 'joule', 'watt-hour',
  ],
  component: () => import('./energy-converter.vue'),
  icon: Power,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
