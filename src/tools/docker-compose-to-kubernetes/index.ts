import { BrandDocker } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.docker-compose-to-kubernetes.title'),
  path: '/docker-compose-to-kubernetes',
  description: t('tools.docker-compose-to-kubernetes.description'),
  keywords: ['docker', 'compose', 'convert', 'kubernetes'],
  component: () => import('./docker-compose-to-kubernetes.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-02-18'),
  category: 'Docker',
});
