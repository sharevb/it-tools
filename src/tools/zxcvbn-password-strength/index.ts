import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';
import PasswordIcon from '~icons/mdi/form-textbox-password';

export const tool = defineTool({
  name: t('tools.zxcvbn-password-strength.title'),
  path: '/zxcvbn-password-strength',
  description: t('tools.zxcvbn-password-strength.description'),
  keywords: ['zxcvbn', 'password', 'strength'],
  component: () => import('./zxcvbn-password-strength.vue'),
  icon: PasswordIcon,
  createdAt: new Date('2025-08-15'),
  category: 'Network',
});
