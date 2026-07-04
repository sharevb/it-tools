import { Cloud } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.k8s-memo.title'),
  path: '/k8s-memo',
  description: t('tools.k8s-memo.description'),
  keywords: ['k8s', 'kubernetes'],
  component: () => import('./k8s-memo.vue'),
  icon: Cloud,
  createdAt: new Date('2025-05-19'),
  category: 'Cheatsheets',
});
