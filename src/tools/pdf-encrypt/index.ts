import { Lock } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.pdf-encrypt.title'),
  path: '/pdf-encrypt',
  description: t('tools.pdf-encrypt.description'),
  keywords: ['pdf', 'encrypt'],
  component: () => import('./pdf-encrypt.vue'),
  icon: Lock,
  createdAt: new Date('2024-01-09'),
  category: 'PDF',
});
