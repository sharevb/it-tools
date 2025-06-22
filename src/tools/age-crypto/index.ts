import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.age-crypto.title'),
  path: '/age-crypto',
  description: translate('tools.age-crypto.description'),
  keywords: ['age'],
  component: () => import('./age-crypto.vue'),
  icon: EyeOff,
  createdAt: new Date('2025-05-08'),
  category: 'Crypto',
});
