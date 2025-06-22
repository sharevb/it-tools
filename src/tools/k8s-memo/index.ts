import { Cloud } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.k8s-memo.title'),
  path: '/k8s-memo',
  description: translate('tools.k8s-memo.description'),
  keywords: ['k8s', 'kubernetes'],
  component: () => import('./k8s-memo.vue'),
  icon: Cloud,
  createdAt: new Date('2025-05-19'),
  category: 'Cheatsheets',
});
