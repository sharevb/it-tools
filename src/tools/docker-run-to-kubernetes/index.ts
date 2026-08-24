import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.docker-run-to-kubernetes.title'),
  path: '/docker-run-to-kubernetes',
  description: t('tools.docker-run-to-kubernetes.description'),
  keywords: ['docker', 'run', 'convert', 'kubernetes'],
  component: () => import('./docker-run-to-kubernetes.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/BrandDocker')),
  createdAt: new Date('2024-02-18'),
  category: 'Docker',
});
