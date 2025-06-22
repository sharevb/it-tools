import { Power } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.energy-converter.title'),
  path: '/energy-converter',
  description: translate('tools.energy-converter.description'),
  keywords: ['energy', 'converter'],
  component: () => import('./energy-converter.vue'),
  icon: Power,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
