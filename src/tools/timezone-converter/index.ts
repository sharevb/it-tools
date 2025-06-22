import { CalendarTime } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.timezone-converter.title'),
  path: '/timezone-converter',
  description: translate('tools.timezone-converter.description'),
  keywords: ['timezone', 'tz', 'date', 'time', 'country', 'converter'],
  component: () => import('./timezone-converter.vue'),
  icon: CalendarTime,
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
