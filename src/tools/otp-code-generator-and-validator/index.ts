import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.otp-generator.title'),
  path: '/otp-generator',
  description: t('tools.otp-generator.description'),
  keywords: [
    'otp',
    'code',
    'generator',
    'validator',
    'one',
    'time',
    'password',
    'authentication',
    'MFA',
    'mobile',
    'device',
    'security',
    'TOTP',
    'Time',
    'HMAC',
  ],
  component: () => import('./otp-code-generator-and-validator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/DeviceMobile')),
  npmPackages: ['crypto-es'],
  category: 'Generators',
});
