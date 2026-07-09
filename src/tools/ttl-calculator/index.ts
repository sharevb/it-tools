import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ttl-calculator.title'),
  path: '/ttl-calculator',
  description: t('tools.ttl-calculator.description'),
  keywords: ['ttl', 'dns', 'calculator', 'time', 'live', 'duration'],
  component: () => import('./ttl-calculator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/CalendarTime')),
  createdAt: new Date('2024-04-20'),
  category: 'Datetime',
});
