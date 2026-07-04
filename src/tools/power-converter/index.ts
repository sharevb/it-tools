import { Power } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.power-converter.title'),
  path: '/power-converter',
  description: t('tools.power-converter.description'),
  keywords: ['power', 'converter', 'units', 'watt', 'horse'],
  component: () => import('./power-converter.vue'),
  icon: Power,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
