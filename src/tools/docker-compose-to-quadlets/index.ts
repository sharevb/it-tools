import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.docker-compose-to-quadlets.title'),
  path: '/docker-compose-to-quadlets',
  description: t('tools.docker-compose-to-quadlets.description'),
  keywords: ['docker', 'compose', 'quadlets'],
  component: () => import('./docker-compose-to-quadlets.vue'),
  icon: BrandDocker,
  createdAt: new Date('2025-07-19'),
  category: 'Docker',
});
