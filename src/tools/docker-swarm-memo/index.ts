import { BrandDocker } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.docker-swarm-memo.title'),
  path: '/docker-swarm-memo',
  description: t('tools.docker-swarm-memo.description'),
  keywords: ['docker', 'swarm', 'memo', 'cheatsheet'],
  component: () => import('./docker-swarm-memo.vue'),
  icon: BrandDocker,
  createdAt: new Date('2025-08-17'),
  category: 'Cheatsheets',
});
