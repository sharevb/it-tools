import { translate as t } from '@/plugins/i18n.plugin';
import { ShieldOff } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.jasypt-string-encryption.title'),
  path: '/jasypt-string-encryption',
  description: t('tools.jasypt-string-encryption.description'),
  keywords: ['jasypt', 'java', 'spring', 'boot', 'string', 'encryption'],
  component: () => import('./jasypt-string-encryption.vue'),
  icon: ShieldOff,
  createdAt: new Date('2026-03-15'),
  category: 'Crypto',
});
