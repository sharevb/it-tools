import { Cloud } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'K8s Cheatsheet',
  path: '/k8s-memo',
  description: 'Kubernetes useful commands',
  keywords: ['k8s', 'kubernetes'],
  component: () => import('./k8s-memo.vue'),
  icon: Cloud,
  createdAt: new Date('2025-05-19'),
  category: 'Cheatsheets',
});
