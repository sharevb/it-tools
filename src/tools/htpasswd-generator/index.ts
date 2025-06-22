import { PasswordRound } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.htpasswd-generator.title'),
  path: '/htpasswd-generator',
  description: translate('tools.htpasswd-generator.description'),
  keywords: ['htpasswd', 'htaccess', 'bcrypt', 'password'],
  component: () => import('./htpasswd-generator.vue'),
  icon: PasswordRound,
  createdAt: new Date('2024-02-20'),
  category: 'Network',
});
