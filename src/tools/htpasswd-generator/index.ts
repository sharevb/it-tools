import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.htpasswd-generator.title'),
  path: '/htpasswd-generator',
  description: t('tools.htpasswd-generator.description'),
  keywords: ['htpasswd', 'htaccess', 'bcrypt', 'password'],
  component: () => import('./htpasswd-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/material/es/PasswordRound')),
  createdAt: new Date('2024-02-20'),
  category: 'Network',
});
