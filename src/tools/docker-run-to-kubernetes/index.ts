import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.docker-run-to-kubernetes.title'),
  path: '/docker-run-to-kubernetes',
  description: translate('tools.docker-run-to-kubernetes.description'),
  keywords: ['docker', 'run', 'convert', 'kubernetes'],
  component: () => import('./docker-run-to-kubernetes.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-02-18'),
  category: 'Docker',
});
