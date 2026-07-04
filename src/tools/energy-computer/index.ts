import { Engine } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.energy-computer.title'),
  path: '/energy-computer',
  description: t('tools.energy-computer.description'),
  keywords: ['energy', 'expense', 'watt', 'kwh', 'computer'],
  component: () => import('./energy-computer.vue'),
  icon: Engine,
  createdAt: new Date('2024-08-15'),
  category: 'Converters',
});
