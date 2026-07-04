import { CalendarTime } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.timezone-converter.title'),
  path: '/timezone-converter',
  description: t('tools.timezone-converter.description'),
  keywords: ['timezone', 'tz', 'date', 'time', 'country', 'converter'],
  component: () => import('./timezone-converter.vue'),
  icon: CalendarTime,
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
