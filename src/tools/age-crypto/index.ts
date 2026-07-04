import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.age-crypto.title'),
  path: '/age-crypto',
  description: t('tools.age-crypto.description'),
  keywords: ['age'],
  component: () => import('./age-crypto.vue'),
  icon: EyeOff,
  createdAt: new Date('2025-05-08'),
  category: 'Crypto',
});
