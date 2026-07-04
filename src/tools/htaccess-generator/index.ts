import { ShieldLock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.htaccess-generator.title'),
  path: '/htaccess-generator',
  description: t('tools.htaccess-generator.description'),
  keywords: ['htaccess'],
  component: () => import('./htaccess-generator.vue'),
  icon: ShieldLock,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
