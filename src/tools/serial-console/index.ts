import { DeviceAnalytics } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.serial-console.title'),
  path: '/serial-console',
  description: t('tools.serial-console.description'),
  keywords: ['serial', 'port', 'console'],
  component: () => import('./serial-console.vue'),
  icon: DeviceAnalytics,
  createdAt: new Date('2025-11-11'),
  category: 'Forensic',
});
