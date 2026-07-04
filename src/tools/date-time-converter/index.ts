import { Calendar } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.date-converter.title'),
  path: '/date-converter',
  description: t('tools.date-converter.description'),
  keywords: ['date', 'time', 'converter', 'iso', 'utc', 'unix', 'epoch', 'timezone', 'year', 'month', 'day', 'minute', 'seconde', 'filetime', 'ldap', 'win32', 'units'],
  component: () => import('./date-time-converter.vue'),
  icon: Calendar,
  npmPackages: ['date-fns'],
  category: 'Datetime',
});
