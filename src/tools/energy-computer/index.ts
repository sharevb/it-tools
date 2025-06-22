import { Engine } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.energy-computer.title'),
  path: '/energy-computer',
  description: translate('tools.energy-computer.description'),
  keywords: ['energy', 'expense', 'watt', 'kwh', 'computer'],
  component: () => import('./energy-computer.vue'),
  icon: Engine,
  createdAt: new Date('2024-08-15'),
  category: 'Converters',
});
