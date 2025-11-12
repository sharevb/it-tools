import { Atom } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.pressure-converter.title'),
  path: '/pressure-converter',
  description: t('tools.pressure-converter.description'),
  keywords: ['pressure', 'converter',
    'units', 'pascal', 'bar', 'torr', 'atmosphere',
  ],
  component: () => import('./pressure-converter.vue'),
  icon: Atom,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
