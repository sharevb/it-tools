import { BrandDocker } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.docker-compose-to-env-file.title'),
  path: '/docker-compose-to-env-file',
  description: t('tools.docker-compose-to-env-file.description'),
  keywords: ['docker', 'compose', 'env', 'environment'],
  component: () => import('./docker-compose-to-env-file.vue'),
  icon: BrandDocker,
  createdAt: new Date('2025-11-11'),
  category: 'Docker',
});
