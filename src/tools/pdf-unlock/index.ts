import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.pdf-unlock.title'),
  path: '/pdf-unlock',
  description: t('tools.pdf-unlock.description'),
  keywords: ['pdf', 'unlock', 'decrypt'],
  component: () => import('./pdf-unlock.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/LockOff')),
  createdAt: new Date('2024-01-09'),
  category: 'PDF',
});
