import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.calendar-converter.title'),
  path: '/calendar-converter',
  description: t('tools.calendar-converter.description'),
  keywords: ['calendar', 'gregorian', 'julian', 'hebrew', 'islamic', 'persian', 'mayan', 'indian', 'french', 'republican', 'iso-8601', 'unix', 'excel', 'converter'],
  component: () => import('./calendar-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Calendar')),
  createdAt: new Date('2026-02-21'),
  category: 'Data',
});
