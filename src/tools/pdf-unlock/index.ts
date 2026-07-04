import { LockOff } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.pdf-unlock.title'),
  path: '/pdf-unlock',
  description: t('tools.pdf-unlock.description'),
  keywords: ['pdf', 'unlock', 'decrypt'],
  component: () => import('./pdf-unlock.vue'),
  icon: LockOff,
  createdAt: new Date('2024-01-09'),
  category: 'PDF',
});
