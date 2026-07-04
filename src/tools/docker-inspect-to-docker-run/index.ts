import { BrandDocker } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.docker-inspect-to-docker-run.title'),
  path: '/docker-inspect-to-docker-run',
  description: t('tools.docker-inspect-to-docker-run.description'),
  keywords: ['docker', 'inspect', 'run'],
  component: () => import('./docker-inspect-to-docker-run.vue'),
  icon: BrandDocker,
  createdAt: new Date('2025-08-15'),
  category: 'Docker',
});
