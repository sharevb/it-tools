import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.pdf-encrypt.title'),
  path: '/pdf-encrypt',
  description: translate('tools.pdf-encrypt.description'),
  keywords: ['pdf', 'encrypt'],
  component: () => import('./pdf-encrypt.vue'),
  icon: Lock,
  createdAt: new Date('2024-01-09'),
  category: 'PDF',
});
