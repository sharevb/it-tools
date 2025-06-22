import { ShieldLock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.htaccess-generator.title'),
  path: '/htaccess-generator',
  description: translate('tools.htaccess-generator.description'),
  keywords: ['htaccess'],
  component: () => import('./htaccess-generator.vue'),
  icon: ShieldLock,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
