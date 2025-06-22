import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.docker-compose-to-kubernetes.title'),
  path: '/docker-compose-to-kubernetes',
  description: translate('tools.docker-compose-to-kubernetes.description'),
  keywords: ['docker', 'compose', 'convert', 'kubernetes'],
  component: () => import('./docker-compose-to-kubernetes.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-02-18'),
  category: 'Docker',
});
