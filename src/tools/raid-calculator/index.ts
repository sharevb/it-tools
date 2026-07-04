import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.raid-calculator.title'),
  path: '/raid-calculator',
  description: t('tools.raid-calculator.description'),
  keywords: ['raid', 'calculator'],
  component: () => import('./raid-calculator.vue'),
  icon: Database,
  createdAt: new Date('2024-07-27'),
  category: 'Network',
});
