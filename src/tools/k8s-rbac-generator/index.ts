import { translate as t } from '@/plugins/i18n.plugin';
import { ShieldChevron } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.k8s-rbac-generator.title'),
  path: '/k8s-rbac-generator',
  description: t('tools.k8s-rbac-generator.description'),
  keywords: ['k8s', 'kubernetes', 'rbac', 'policy', 'generator'],
  component: () => import('./k8s-rbac-generator.vue'),
  icon: ShieldChevron,
  createdAt: new Date('2026-03-07'),
  category: 'Docker',
});
