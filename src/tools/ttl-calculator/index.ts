import { CalendarTime } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ttl-calculator.title'),
  path: '/ttl-calculator',
  description: translate('tools.ttl-calculator.description'),
  keywords: ['ttl', 'dns', 'calculator', 'time', 'live', 'duration'],
  component: () => import('./ttl-calculator.vue'),
  icon: CalendarTime,
  createdAt: new Date('2024-04-20'),
  category: 'Datetime',
});
