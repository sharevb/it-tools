import { Key } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.jwt-generator.title'),
  path: '/jwt-generator',
  description: t('tools.jwt-generator.description'),
  keywords: [
    'jwt',
    'generator',
    'editor',
    'encode',
    'typ',
    'alg',
    'iss',
    'sub',
    'aud',
    'exp',
    'nbf',
    'iat',
    'jti',
    'json',
    'web',
    'token',
  ],
  component: () => import('./jwt-generator.vue'),
  icon: Key,
  createdAt: new Date('2024-08-15'),
  category: 'Crypto',
});
