import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.docker-run-to-quadlets.title'),
  path: '/docker-run-to-quadlets',
  description: t('tools.docker-run-to-quadlets.description'),
  keywords: ['docker', 'run', 'podman', 'quadlets'],
  component: () => import('./docker-run-to-quadlets.vue'),
  icon: BrandDocker,
  createdAt: new Date('2025-07-19'),
  category: 'Docker',
});
